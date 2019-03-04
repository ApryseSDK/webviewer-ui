/**
 * We can just pass object down as a prop, but many properties of that object won't be used by the child component, 
 * so here we select properties that will be used.
 * @param annotation is an annotation created by a tool
 * @return current style of that object. 
 */

export default annotation => {
  const styleProperty = ['FillColor', 'StrokeColor', 'TextColor', 'Opacity', 'StrokeThickness', 'FontSize'];
  const style = {};

  styleProperty.forEach(property => {
    const value = annotation[property];
 
    if (value !== null && value !== undefined) {
      style[property] = annotation[property];
    }
  });

  // Special case for the highlight annotation. It shouldn't have opacity
  if (annotation.elementName === 'highlight') {
    style.Opacity = null;
  }

  return style;
};