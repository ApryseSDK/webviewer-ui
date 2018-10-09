/**
 * We can just pass object down as a prop, but many properties of that object won't be used by the child component, 
 * so here we select properties that will be used.
 * @param annotation is an annotation created by a tool
 * @return current style of that object. 
 */

const getStyle = annotation => {
  const styleProperty = ['FillColor', 'StrokeColor', 'TextColor', 'Opacity', 'StrokeThickness', 'FontSize'];
  const style = {};

  styleProperty.forEach(property => {
    if (annotation[property]) {
      style[property] = annotation[property];
    }
  });

  // Special case for the highlight annotation. It shouldn't have opacity
  if (annotation.Subject === 'Highlight') {
    style.Opacity = null;
  }

  return style;
};

export default getStyle;