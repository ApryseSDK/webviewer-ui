import isBorderButtonActive from './isBorderButtonActive';
import getButtonDisplay from './getBorderDisplayButton';

/**
 * @ignore
 * Calculate which border buttons should be active based on current cell selection
 * @returns {string[]} Array of active border button data elements
 */
const getActiveBorderButtons = () => {
  const buttonDisplay = getButtonDisplay();
  const activeBorderButtons = [];

  Object.keys(buttonDisplay).forEach((borderType) => {
    if (buttonDisplay[borderType] && isBorderButtonActive(borderType)) {
      activeBorderButtons.push(borderType);
    }
  });

  return activeBorderButtons;
};

export default getActiveBorderButtons;
