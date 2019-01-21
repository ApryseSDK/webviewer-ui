export default (style = {}, iconColorPalette) => {
  const { TextColor, StrokeColor, FillColor } = style;
  if (iconColorPalette === "text" && TextColor){
    return TextColor.toHexString();
  }
  if (iconColorPalette === "border" && StrokeColor){
    return StrokeColor.toHexString();
  }
  if (iconColorPalette === "fill" && FillColor){
    return FillColor.toHexString();
  }
  return [TextColor, StrokeColor, FillColor].reduce((result, color) => {
    if (!result && color !== null && color !== undefined) {
      result = color.toHexString();
    }  
    return result;
  }, '');
};