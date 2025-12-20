/**
 * Calculate the updated border styles after applying a border action
 * @param {Object} currentBorderStyles - Current border styles (top, left, bottom, right)
 * @param {string} borderType - Type of border action (None, All, Top, Left, Right, Bottom, Outside, Inside, Vertical, Horizontal)
 * @param {string} style - Border style to apply
 * @param {string} color - Border color to apply
 * @returns {Object} Updated border styles
 * @ignore
 */
const getUpdatedBorderStyles = (currentBorderStyles, borderType, style, color) => {
  const newBorder = { color, style };
  const noBorder = { color: null, style: 'None' };

  switch (borderType) {
    case 'None':
      return {
        top: noBorder,
        left: noBorder,
        bottom: noBorder,
        right: noBorder,
      };
    case 'All':
    case 'Outside':
      return {
        top: newBorder,
        left: newBorder,
        bottom: newBorder,
        right: newBorder,
      };
    case 'Top':
    case 'Left':
    case 'Bottom':
    case 'Right': {
      const { top, left, bottom, right } = currentBorderStyles || {};
      const hasBorderStyle = (border) => border && border.style && border.style !== 'None';
      const allBordersActive = [top, left, bottom, right].every(hasBorderStyle);

      if (allBordersActive) {
        const clearedStyles = {
          top: noBorder,
          left: noBorder,
          bottom: noBorder,
          right: noBorder,
        };
        const sideKey = borderType.toLowerCase();
        clearedStyles[sideKey] = newBorder;
        return clearedStyles;
      }

      const updatedStyles = {
        top: { ...(currentBorderStyles?.top ?? noBorder) },
        left: { ...(currentBorderStyles?.left ?? noBorder) },
        bottom: { ...(currentBorderStyles?.bottom ?? noBorder) },
        right: { ...(currentBorderStyles?.right ?? noBorder) },
      };

      const sideKey = borderType.toLowerCase();
      updatedStyles[sideKey] = newBorder;

      return updatedStyles;
    }
    case 'Inside':
    case 'Vertical':
    case 'Horizontal':
      return currentBorderStyles;
    default:
      return currentBorderStyles;
  }
};

export default getUpdatedBorderStyles;