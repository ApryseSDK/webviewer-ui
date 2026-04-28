// Maps a v11 WidgetAnnotation subclass to the legacy form field type string.
// This replaces the removed v10 annotation.getFormFieldPlaceholderType() API.
const getFormFieldAnnotationType = (annotation) => {
  if (!annotation) return null;
  const Annotations = window.Core.Annotations;
  if (annotation instanceof Annotations.TextWidgetAnnotation) return 'TextFormField';
  if (annotation instanceof Annotations.SignatureWidgetAnnotation) return 'SignatureFormField';
  if (annotation instanceof Annotations.CheckButtonWidgetAnnotation) return 'CheckBoxFormField';
  if (annotation instanceof Annotations.RadioButtonWidgetAnnotation) return 'RadioButtonFormField';
  if (annotation instanceof Annotations.ListWidgetAnnotation) return 'ListBoxFormField';
  if (annotation instanceof Annotations.ChoiceWidgetAnnotation) return 'ComboBoxFormField';
  return null;
};

export default getFormFieldAnnotationType;
