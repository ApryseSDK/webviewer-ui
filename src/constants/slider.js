export const svgHeight = 21;
export const getCircleRadius = (isMobile, customCircleRadius) => {
  if (isMobile) {
    return 8;
  }
  if (customCircleRadius) {
    return customCircleRadius;
  }
  return 4;
};
export const circleRadius = 8;

export const getStrokeSliderSteps = (isFreeText = false) => {
  const firstStep = isFreeText ? 0 : 0.10;
  return [firstStep, 0.25, 0.50, 0.75, ...Array.from({ length: 20 }, (_, i) => i + 1)];
};

export const getStrokeDisplayValue = (strokeThickness) => {
  if (typeof strokeThickness === 'string' || strokeThickness instanceof String) {
    strokeThickness = parseFloat(strokeThickness, 10);
  }

  const placeOfDecimal =
    Math.floor(strokeThickness) !== strokeThickness
      ? strokeThickness?.toString().split('.')[1].length || 0
      : 0;
  if (strokeThickness === 0 || (strokeThickness >= 1 && (placeOfDecimal > 2 || placeOfDecimal === 0))) {
    return `${Math.round(strokeThickness)}pt`;
  }
  return `${parseFloat(strokeThickness).toFixed(2)}pt`;
};
