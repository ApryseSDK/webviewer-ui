import core from 'core';

/**
 * We can just pass object down as a prop, but many properties of that object won't be used by the child component,
 * so here we select properties that will be used.
 * @ignore
 * @param annotation is an annotation created by a tool
 * @return current style of that object.
 */

export default annotation => {
  const styleProperty = [
    'FillColor',
    'StrokeColor',
    'TextColor',
    'Opacity',
    'StrokeThickness',
    'FontSize',
    'Precision',
    'Scale',
    'Style',
  ];
  const style = {};

  styleProperty.forEach(property => {
    const value = annotation[property];

    if (value !== null && value !== undefined) {
      style[property] = annotation[property];
    }
  });

  // Special case for the highlight annotation. It only have opacity when blend mode is working
  if (annotation.elementName === 'highlight' && !core.isBlendModeSupported(annotation['BlendMode'])) {
    style.Opacity = null;
  }
  // we do not have sliders to show up for redaction annots
  if (annotation instanceof window.Annotations.RedactionAnnotation) {
    style.Opacity = null;
    style.StrokeThickness = null;
    style.FontSize = null;
  }

  // widget don't support opacity
  if (annotation.isFormFieldPlaceholder()) {
    style.Opacity = null;
  }

  return style;
};
