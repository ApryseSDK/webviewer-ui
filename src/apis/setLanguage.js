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

export default language => {
  const promise = i18next.changeLanguage(language);
  setDatePickerLocale(promise);
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

