import getRootNode from 'helpers/getRootNode';
import getAppRect from 'helpers/getAppRect';

export function getFlyoutPositionOnElement(dataElement, flyoutRef) {
  // Get the container, toggle element, and target elements
  const appRect = getAppRect();
  const referenceElement = getRootNode().querySelector(`[data-element="${dataElement}"]`);
  const referenceButtonRect = referenceElement.getBoundingClientRect();
  const parentHeader = referenceElement.closest('.ModularHeader');
  const targetElement = flyoutRef.current;
  const defaultOffset = 6;

  // Calculate the available space on the left and right sides of the reference element within the container
  const availableSpaceLeft = referenceButtonRect.left - appRect.left;
  const availableSpaceRight = appRect.right - referenceButtonRect.right;
  let flyoutX = referenceButtonRect.left - appRect.left;

  const isRTL = parentHeader?.closest('[dir="rtl"], [dir="ltr"]')?.dir === 'rtl';
  const shouldOpenRight = parentHeader?.classList.contains(!isRTL ? 'LeftHeader' : 'RightHeader');
  const shouldOpenLeft = parentHeader?.classList.contains(isRTL ? 'LeftHeader' : 'RightHeader');
  if (shouldOpenRight) {
    flyoutX += referenceButtonRect.width + defaultOffset;
  } else if (shouldOpenLeft) {
    flyoutX -= (targetElement.clientWidth + defaultOffset);
  } else if (availableSpaceLeft >= availableSpaceRight) {
    flyoutX = referenceButtonRect.right - targetElement.clientWidth - appRect.left;
  }

  // Calculate the available space above and below the reference element within the container
  const availableSpaceAbove = referenceButtonRect.top - appRect.top;
  const availableSpaceBelow = appRect.bottom - referenceButtonRect.bottom;
  let flyoutY = referenceButtonRect.top - appRect.top;

  if (parentHeader?.classList.contains('TopHeader')) {
    flyoutY += referenceButtonRect.height + defaultOffset;
  } else if (parentHeader?.classList.contains('BottomHeader')) {
    flyoutY -= (targetElement.clientHeight + defaultOffset);
  } else if (availableSpaceAbove >= availableSpaceBelow) {
    if (shouldOpenLeft || shouldOpenRight) {
      flyoutY = referenceButtonRect.bottom - targetElement.clientHeight;
    } else {
      flyoutY = referenceButtonRect.top - targetElement.clientHeight - defaultOffset;
    }

    // This case is for flyouts toggled by elements that are not on a header
  } else if (availableSpaceBelow > targetElement.clientHeight && !parentHeader) {
    flyoutY += referenceButtonRect.height + defaultOffset;
  }

  return { x: flyoutX, y: flyoutY };
}
