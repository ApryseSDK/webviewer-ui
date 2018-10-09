export default (style = {}) => {
  const { TextColor, StrokeColor, FillColor } = style;

  return [TextColor, StrokeColor, FillColor].reduce((result, color) => {
    if (!result && color !== null && color !== undefined) {
      result = color.toHexString();
    }  
    return result;
  }, '');
};