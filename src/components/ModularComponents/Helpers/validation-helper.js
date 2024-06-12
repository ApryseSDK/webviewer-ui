import { JUSTIFY_CONTENT } from 'constants/customizationVariables';

export const isJustifyContentValid = (justifyContent) => {
  const validJustifications = Object.values(JUSTIFY_CONTENT);
  if (!validJustifications.includes(justifyContent)) {
    console.warn(`${justifyContent} is not a valid value for justifyContent. Please use one of the following: ${validJustifications}`);
    return false;
  }
  return true;
};

export const isGapValid = (gap) => {
  if (isNaN(gap) || gap < 0) {
    console.warn(`${gap} is not a valid value for gap. Please use a number, which represents the gap between items in pixels.`);
    return false;
  }
  return true;
};

export const isGrowValid = (grow) => {
  if (isNaN(grow) || grow < 0) {
    console.warn(`${grow} is not a valid value for grow. Please use a number, which represents the flex-grow property of item.`);
    return false;
  }
  return true;
};