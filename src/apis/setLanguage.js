/**
 * Set the language of WebViewer UI.
 * @method WebViewerInstance#setLanguage
 * @param {string} language The language WebViewer UI will use. By default, following languages are supported: en, zh_cn, fr.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setLanguage('fr'); // set the language to French
  });
 */

import i18next from 'i18next';
import core from 'core';
import actions from 'actions';
import dayjs from 'dayjs';
import languageRules from 'constants/languageRules';

export default store => language => {
  let languageObj = null;
  let languageToImportLocaleFile = language;

  if (languageRules[language]) {
    languageObj = languageRules[language];
    languageToImportLocaleFile = languageObj.dayjs || language;
  }

  // load locale file from "dayjs/locale/" folder, must match filename
  import(`dayjs/locale/${languageToImportLocaleFile}`).then(() => {
    dayjs.locale(languageToImportLocaleFile);
  }).catch(() => {
    dayjs.locale('en');
  }).finally(() => {
    store.dispatch(actions.setLanguage(language));
    const promise = i18next.changeLanguage(language);
    setDatePickerLocale(promise);
  });
};

const setDatePickerLocale = i18nextPromise => {
  i18nextPromise.then(t => {
    const { DatePickerWidgetAnnotation } = window.Annotations;
    const obj = t('datePicker', { 'returnObjects': true });
    const options = DatePickerWidgetAnnotation.datePickerOptions;
    options['i18n'] = obj;
    DatePickerWidgetAnnotation.datePickerOptions = options;

    core.getAnnotationsList()
      .filter(annot => annot instanceof DatePickerWidgetAnnotation)
      .forEach(widget => {
        widget.refreshDatePicker();
      });
  });
};
