import { PANEL_LOCATION } from 'constants/customizationVariables';
import i18next from 'i18next';

/**
 * @ignore
 * Safe wrapper: in multi-instance WC mode the global i18next singleton may not be initialized (services is undefined).  Fall back to 'ltr'.
 */
const getDir = () => {
  try {
    return i18next.dir() ?? 'ltr';
  } catch {
    return 'ltr';
  }
};

export const isLogicalLeft = (location, isRightToLeft) => {
  return isRightToLeft
    ? location === PANEL_LOCATION.END
    : location === PANEL_LOCATION.START;
};

export const isLogicalRight = (location, isRightToLeft) => {
  return isRightToLeft
    ? location === PANEL_LOCATION.START
    : location === PANEL_LOCATION.END;
};

export const isElementOnLeftSide = (location) => {
  const isRightToLeft = getDir() === 'rtl';
  const isLeftPhysical = location === PANEL_LOCATION.LEFT;
  const isLeftDefault = !isRightToLeft && !location;
  return isLeftPhysical || isLeftDefault || isLogicalLeft(location, isRightToLeft);
};

export const isElementOnRightSide = (location) => {
  const isRightToLeft = getDir() === 'rtl';
  const isRightPhysical = location === PANEL_LOCATION.RIGHT;
  const isRightDefault = isRightToLeft && !location;
  return isRightPhysical || isRightDefault || isLogicalRight(location, isRightToLeft);
};

export const isEquivalentPanelLocation = (location, itemLocation) => {
  const locationIsLeft = isElementOnLeftSide(location);
  const itemIsLeft = isElementOnLeftSide(itemLocation);
  const locationIsRight = isElementOnRightSide(location);
  const itemIsRight = isElementOnRightSide(itemLocation);

  return (locationIsLeft && itemIsLeft) || (locationIsRight && itemIsRight);
};