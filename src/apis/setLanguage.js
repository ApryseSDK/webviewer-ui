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
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import dayjs from 'dayjs';
import languageRules from 'constants/languageRules';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import getAvailableLanguages from './getAvailableLanguages';
import textToolNames from 'constants/textToolNames';
import localStorageManager from 'helpers/localStorageManager';
import { getInstanceID } from 'helpers/getRootNode';
import setToolStyles from 'helpers/setToolStyles';

let pendingLanguageTimeout;
export default (store) => async (language) => {
  if (pendingLanguageTimeout) {
    clearTimeout(pendingLanguageTimeout);
  }

  const availableLanguages = getAvailableLanguages();
  if (!availableLanguages.includes(language)) {
    console.warn(`Language with ISO code "${language}" is not supported.`);
    return;
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
        await import(`dayjs/locale/${languageToImportLocaleFile}.js`);
        dayjs.locale(languageToImportLocaleFile);
      } catch (e) {
        dayjs.locale('en');
      } finally {
        const languageEventObject = {
          prev: selectors.getCurrentLanguage(store.getState()),
          next: language,
        };
        store.dispatch(actions.setLanguage(language));
        const pendingLanguagePromise = i18next.changeLanguage(language);
        setDatePickerLocale(pendingLanguagePromise, language);
        await pendingLanguagePromise;

        updateTextToolDefaults();

        fireEvent(Events['LANGUAGE_CHANGED'], languageEventObject);
      }
      resolve();
    }, 0);
  });
};

const setDatePickerLocale = (i18nextPromise, language) => {
  i18nextPromise.then((t) => {
    const { DatePickerWidgetAnnotation } = window.Core.Annotations;
    const obj = t('datePicker', { 'returnObjects': true });
    const options = DatePickerWidgetAnnotation.datePickerOptions;
    options['i18n'] = obj;
    options['local'] = language;

    DatePickerWidgetAnnotation.datePickerOptions = options;

    core.getAnnotationsList()
      .filter((annot) => annot instanceof DatePickerWidgetAnnotation)
      .forEach((widget) => {
        widget.refreshDatePicker();
      });
  });
};

const applyTextToolDirectionalDefaults = (toolName, directionSpecificStyles) => {
  const isRTL = i18next?.dir() === 'rtl';
  const rtlDefaults = directionSpecificStyles || {};

  const font = isRTL ? rtlDefaults.Font || 'Noto Sans Arabic' : 'Helvetica';
  const textAlign = isRTL ? rtlDefaults.TextAlign || 'right' : 'left';

  setToolStyles(toolName, 'Font', font);
  setToolStyles(toolName, 'TextAlign', textAlign);
};

const updateTextToolDefaults = () => {
  const { ToolNames } = window.Core.Tools;

  for (const toolKey of textToolNames) {
    const toolName = ToolNames[toolKey];
    let directionSpecificStyles = null;

    if (localStorageManager.isLocalStorageEnabled()) {
      const instanceId = getInstanceID();
      directionSpecificStyles = JSON.parse(localStorageManager.getItemSynchronous(`${instanceId}-toolData-${toolName}-${i18next.dir()}`));
    }
    if (directionSpecificStyles && (directionSpecificStyles.Font || directionSpecificStyles.TextAlign)) {
      if (directionSpecificStyles.Font) {
        setToolStyles(toolName, 'Font', directionSpecificStyles.Font);
      }
      if (directionSpecificStyles.TextAlign) {
        setToolStyles(toolName, 'TextAlign', directionSpecificStyles.TextAlign);
      }
    } else {
      applyTextToolDirectionalDefaults(toolName);
    }
  }
};
