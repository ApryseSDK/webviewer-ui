/**
 * Set the language of WebViewer UI.
 * @method UI.setLanguage
 * @param {string} language The language WebViewer UI will use. By default, following languages are supported: en, zh_cn, fr.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setLanguage('fr'); // set the language to French
  });
 */

import i18next from 'i18next';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import dayjs from 'dayjs';
import languageRules from 'constants/languageRules';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';

export default (store) => (language) => {
  let languageObj = null;
  let languageToImportLocaleFile = language;

  if (languageRules[language]) {
    languageObj = languageRules[language];
    languageToImportLocaleFile = languageObj.dayjs || language;
  }

  // load locale file from "dayjs/locale/" folder, must match filename
  import(`dayjs/locale/${languageToImportLocaleFile}.js`).then(() => {
    dayjs.locale(languageToImportLocaleFile);
  }).catch(() => {
    dayjs.locale('en');
  }).finally(() => {
    const languageEventObject = {
      prev: selectors.getCurrentLanguage(store.getState()),
      next: language,
    };
    store.dispatch(actions.setLanguage(language));
    const promise = i18next.changeLanguage(language);
    promise.then(() => fireEvent(Events['LANGUAGE_CHANGED'], languageEventObject));
    setDatePickerLocale(promise, language);
  });
};

const setDatePickerLocale = (i18nextPromise, language) => {
  i18nextPromise.then((t) => {
    const { DatePickerWidgetAnnotation } = window.Annotations;
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
