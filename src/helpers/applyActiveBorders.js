import setCellBorder from './setCellBorder';

/**
 * Apply borders to the currently active border buttons with new style/color
 * @param {string[]} activeBorderButtons - Array of active border button names
 * @param {string} style - Border style to apply
 * @param {string} color - Border color to apply
 * @ignore
 */
const applyActiveBorders = (activeBorderButtons, style, color) => {
  if (!activeBorderButtons || activeBorderButtons.length === 0) {
    return;
  }

  if (activeBorderButtons.length === 1 && activeBorderButtons[0] === 'None') {
    return;
  }

  activeBorderButtons.forEach((borderType) => {
    if (borderType !== 'None') {
      const border = {
        type: borderType,
        style,
        color
      };
      setCellBorder(border);
    }
  });
};

export default applyActiveBorders;
