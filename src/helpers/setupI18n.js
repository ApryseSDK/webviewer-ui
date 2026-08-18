import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import languageRules from '../constants/languageRules';
import getAvailableLanguages from '../apis/getAvailableLanguages';

// https://github.com/isaachinman/next-i18next/issues/562
i18next.languages = getAvailableLanguages();
// this is required for Cordova https://github.com/i18next/i18next-http-backend/issues/23#issuecomment-718929822
const requestWithXmlHttpRequest = (options, url, payload, callback) => {
  try {
    const request = new XMLHttpRequest();
    request.open('GET', url, 1);
    if (!options.crossDomain) {
      request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }
    request.withCredentials = !!options.withCredentials;
    if (payload) {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    if (request.overrideMimeType) {
      request.overrideMimeType('application/json');
    }
    let headers = options.customHeaders;
    headers = typeof headers === 'function' ? headers() : headers;
    if (headers) {
      for (const i in headers) {
        request.setRequestHeader(i, headers[i]);
      }
    }
    request.onreadystatechange = () => {
      // in android webview loading a file is status status 0
      request.readyState > 3 && callback(request.status >= 400 ? request.statusText : null, { status: request.status || 200, data: request.responseText });
    };
    request.send(payload);
  } catch (e) {
    console.warn(e);
  }
};

export default (state, i18n, documentViewer) => {
  // Use per-instance i18n if provided, otherwise fall back to global singleton
  const i18nInstance = i18n || i18next;
  i18nInstance.languages = getAvailableLanguages();
  const options = {
    fallbackLng: 'en',
    nsSeparator: false,
    react: {
      useSuspense: false,
    },
  };
  const callback = (err, t) => {
    window.Core.Annotations.Utilities.setAnnotationSubjectHandler((type) => t(`annotation.${type}`));

    window.Core.Tools.SignatureCreateTool.setTextHandler(() => t('message.signHere'));

    window.Core.Tools.SignatureCreateTool.setInitialsTextHandler(() => t('option.type.initials'));

    window.Core.Tools.FreeTextCreateTool.setTextHandler(() => t('message.insertTextHere'));

    window.Core.Tools.CalloutCreateTool.setTextHandler(() => t('message.insertTextHere'));

    // Use `setDefaultMeasurementLabelsHandler` (not the public `setMeasurementLabelsHandler`)
    // to register these translated defaults. This call always runs per DocumentViewer at init,
    // so if it shared the same tier as the public API it would permanently shadow a customer's
    // legacy global `setMeasurementLabelsHandler(handler)` call made after init. See
    // ArcMeasurementCreateTool.ts for the full priority order.
    window.Core.Tools.ArcMeasurementCreateTool?.setDefaultMeasurementLabelsHandler?.(() => {
      return {
        length: t('option.measurementOverlay.length'),
        radius: t('option.measurementOverlay.radius'),
        angle: t('option.measurementOverlay.angle'),
      };
    }, documentViewer);
  };

  const i18nURL = window.isApryseWebViewerWebComponent
    ? `${window.webViewerPath || './'}ui/i18n/{{ns}}-{{lng}}.json`
    : './i18n/{{ns}}-{{lng}}.json';
  const backendOptions = {
    ...options,
    backend: {
      loadPath: i18nURL,
      request: requestWithXmlHttpRequest,
    },
  };

  if (state.advanced.disableI18n) {
    i18nInstance.init(options, callback);
  } else {
    i18nInstance.use(HttpApi).init(backendOptions, callback);
  }

  // In multi-instance mode, also initialize the global i18next singleton so that
  // legacy code importing `i18next` directly (e.g. i18next.t(), i18next.getFixedT())
  // doesn't crash.  The per-instance i18n from I18nextProvider is still used for
  // language isolation; the global just acts as a shared fallback.
  if (i18n && i18n !== i18next && !i18next.isInitialized && !i18next.isInitializing) {
    i18next.languages = getAvailableLanguages();
    if (state.advanced.disableI18n) {
      i18next.init(options);
    } else {
      i18next.use(HttpApi).init(backendOptions);
    }
  }

  // set custom rules. since i18next doesn't support (i.e 'zh-ch', 'zh-tw', or 'pt-br')
  // have to look inside the i18n source code "getRule" function to see what rule we can copy
  Object.keys(languageRules).forEach((lang) => {
    if (languageRules[lang].i18next) {
      const rule = i18nInstance.services.pluralResolver.getRule(languageRules[lang].i18next);
      i18nInstance.services.pluralResolver.addRule(lang, rule);
    }
  });
};
