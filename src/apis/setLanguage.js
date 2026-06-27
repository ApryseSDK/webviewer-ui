/**
 * Set the language of WebViewer UI.
 * @method UI.setLanguage
 * @param {string} language The language WebViewer UI will use. By default, following languages are supported: en, zh_cn, fr.
 * @returns {Promise<void>} A promise which is resolved after the language is set.
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.setLanguage('fr'); // set the language to French
  });
 */
/* eslint-disable no-unsanitized/method */
import i18next from 'i18next';
import actions from 'actions';
import selectors from 'selectors';
import dayjs from 'dayjs';
import languageRules from 'constants/languageRules';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import textToolNames from 'constants/textToolNames';
import localStorageManager from 'helpers/localStorageManager';
import { getInstanceID } from 'helpers/getRootNode';
import setToolStyles from 'helpers/setToolStyles';
import core from 'core';

// We need to use import mapping instead of dynamic import to avoid static analysis issues in Vite
const localGetter = async (language) => {
  switch (language) {
    case 'bn':
      return import('dayjs/locale/bn');
    case 'cs':
      return import('dayjs/locale/cs');
    case 'de':
      return import('dayjs/locale/de');
    case 'el':
      return import('dayjs/locale/el');
    case 'es':
      return import('dayjs/locale/es');
    case 'fr':
      return import('dayjs/locale/fr');
    case 'hi':
      return import('dayjs/locale/hi');
    case 'hu':
      return import('dayjs/locale/hu');
    case 'id':
      return import('dayjs/locale/id');
    case 'it':
      return import('dayjs/locale/it');
    case 'ja':
      return import('dayjs/locale/ja');
    case 'ko':
      return import('dayjs/locale/ko');
    case 'ms':
      return import('dayjs/locale/ms');
    case 'nl':
      return import('dayjs/locale/nl');
    case 'pl':
      return import('dayjs/locale/pl');
    case 'pt-br':
      return import('dayjs/locale/pt-br');
    case 'ro':
      return import('dayjs/locale/ro');
    case 'ru':
      return import('dayjs/locale/ru');
    case 'sv':
      return import('dayjs/locale/sv');
    case 'th':
      return import('dayjs/locale/th');
    case 'tr':
      return import('dayjs/locale/tr');
    case 'uk':
      return import('dayjs/locale/uk');
    case 'ur':
      return import('dayjs/locale/ur');
    case 'vi':
      return import('dayjs/locale/vi');
    case 'zh-cn':
      return import('dayjs/locale/zh-cn');
    case 'zh-tw':
      return import('dayjs/locale/zh-tw');
    default:
      return import('dayjs/locale/en');
  }
};

let pendingLanguageTimeout;
export default (store, instanceI18n) => async (language) => {
  // Use per-instance i18n if provided, otherwise fall back to global singleton
  const i18n = instanceI18n || i18next;
  if (pendingLanguageTimeout) {
    clearTimeout(pendingLanguageTimeout);
  }

  await new Promise((resolve) => {
    pendingLanguageTimeout = setTimeout(async () => {
      let languageObj = null;
      let languageToImportLocaleFile = language;

      if (languageRules[language]) {
        languageObj = languageRules[language];
        languageToImportLocaleFile = languageObj.dayjs || language;
      }

      // load locale file from "dayjs/locale/" folder, must match filename
      try {
        await localGetter(languageToImportLocaleFile);
        dayjs.locale(languageToImportLocaleFile);
      } catch (e) {
        dayjs.locale('en');
      } finally {
        const prev = selectors.getCurrentLanguage(store.getState());
        store.dispatch(actions.setLanguage(language));
        const t = await i18n.changeLanguage(language);
        // In WC multi-instance mode, instanceI18n is a separate i18next.createInstance().
        // The global `i18next` singleton is still used by non-component modules via the
        // `helpers/getCurrentT` helper (event listeners, redux thunks, sort strategies,
        // page-manipulation helpers, etc.). Mirror the language change to the global so
        // those callsites stay in sync.
        if (i18n !== i18next && i18next.isInitialized) {
          try {
            await i18next.changeLanguage(language);
          } catch {
            // global may not be ready yet; per-instance change above is authoritative
          }
        }
        setDatePickerLocale(t, language);
        // In WC multi-instance mode, instanceI18n is a separate i18next.createInstance().
        // The global `i18next` singleton is still used by legacy callsites that import
        // it directly (rightToLeft.js's getDir(), sortStrategies.js's i18next.t(),
        // event listeners under src/ui/src/event-listeners/, etc.). Mirror the
        // language change to the global so those callsites stay in sync.
        if (i18n !== i18next && i18next.isInitialized) {
          try {
            await i18next.changeLanguage(language);
          } catch {
            // global may not be ready yet; per-instance change above is authoritative
          }
        }

        updateTextToolDefaults(i18n);
        updateArcMeasurementLabels(t);

        fireEvent(Events['LANGUAGE_CHANGED'], [prev, language]);
      }
      resolve();
    }, 0);
  });
};

const setDatePickerLocale = (t, language) => {
  const { DatePickerWidgetAnnotation } = window.Core.Annotations;
  const obj = t('datePicker', { 'returnObjects': true });
  const options = DatePickerWidgetAnnotation.datePickerOptions;
  options['i18n'] = obj;
  options['locale'] = language;

  core.getAnnotationsList()
    .filter((annot) => annot instanceof DatePickerWidgetAnnotation)
    .forEach((widget) => {
      widget.refreshDatePicker();
    });
};

const applyTextToolDirectionalDefaults = (toolName, directionSpecificStyles, i18n) => {
  let dir;
  try {
    dir = (i18n || i18next).dir();
  } catch {
    dir = 'ltr';
  }
  const isRTL = dir === 'rtl';
  const rtlDefaults = directionSpecificStyles || {};

  const font = isRTL ? rtlDefaults.Font || 'Noto Sans Arabic' : 'Helvetica';
  const textAlign = isRTL ? rtlDefaults.TextAlign || 'right' : 'left';

  setToolStyles(toolName, 'Font', font);
  setToolStyles(toolName, 'TextAlign', textAlign);
};

const updateTextToolDefaults = (i18n) => {
  const { ToolNames } = window.Core.Tools;

  let dir;
  try {
    dir = (i18n || i18next).dir();
  } catch {
    dir = 'ltr';
  }

  for (const toolKey of textToolNames) {
    const toolName = ToolNames[toolKey];
    let directionSpecificStyles = null;

    if (localStorageManager.isLocalStorageEnabled()) {
      const instanceId = getInstanceID();
      directionSpecificStyles = JSON.parse(localStorageManager.getItemSynchronous(`${instanceId}-toolData-${toolName}-${dir}`));
    }
    if (directionSpecificStyles && (directionSpecificStyles.Font || directionSpecificStyles.TextAlign)) {
      if (directionSpecificStyles.Font) {
        setToolStyles(toolName, 'Font', directionSpecificStyles.Font);
      }
      if (directionSpecificStyles.TextAlign) {
        setToolStyles(toolName, 'TextAlign', directionSpecificStyles.TextAlign);
      }
    } else {
      applyTextToolDirectionalDefaults(toolName, null, i18n);
    }
  }
};

const updateArcMeasurementLabels = (t) => {
  window.Core.Tools.ArcMeasurementCreateTool?.setMeasurementLabelsHandler?.(() => ({
    length: t('option.measurementOverlay.length'),
    radius: t('option.measurementOverlay.radius'),
    angle: t('option.measurementOverlay.angle'),
  }));
};
