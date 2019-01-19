export default (style = {}, iconColor) => {
  const { TextColor, StrokeColor, FillColor } = style;
  if (iconColor === "text" && TextColor){
    return TextColor.toHexString();
  }
  if (iconColor === "border" && StrokeColor){
    return StrokeColor.toHexString();
  }
  if (iconColor === "fill" && FillColor){
    return FillColor.toHexString();
  }
  return [TextColor, StrokeColor, FillColor].reduce((result, color) => {
    if (!result && color !== null && color !== undefined) {
      result = color.toHexString();
    }  
    return result;
  }, '');
};