import core from 'core';

export default function(i18nextPromise) {
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
}
