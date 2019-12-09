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

  return style;
};
