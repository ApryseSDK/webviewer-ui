/**
 * Calculate which border buttons should be active based on border styles
 * @param {Object} borderStyles - Object containing top, left, bottom, right border styles
 * @returns {string[]} Array of active border button names
 * @ignore
 */
const calculateActiveBorderButtons = (borderStyles) => {
  if (!borderStyles) {
    return ['None'];
  }

  const { top, left, bottom, right } = borderStyles;

  const allBordersEmpty = [top, left, bottom, right].every(
    (border) => !border || !border.style || border.style === 'None'
  );

  if (allBordersEmpty) {
    return ['None'];
  }

  const allBordersStyled = [top, left, bottom, right].every(
    (border) => border && border.style && border.style !== 'None'
  );

  if (allBordersStyled) {
    return ['Outside'];
  }

  const activeButtons = [];

  if (left?.style && left.style !== 'None') {
    activeButtons.push('Left');
  }
  if (right?.style && right.style !== 'None') {
    activeButtons.push('Right');
  }
  if (top?.style && top.style !== 'None') {
    activeButtons.push('Top');
  }
  if (bottom?.style && bottom.style !== 'None') {
    activeButtons.push('Bottom');
  }

  return activeButtons.length > 0 ? activeButtons : ['None'];
};

export default calculateActiveBorderButtons;
