import getRootNode from 'helpers/getRootNode';
import getAppRect from 'helpers/getAppRect';

export function getFlyoutPositionOnElement(dataElement, flyoutRef) {
  // Resolve the per-instance root from the flyout element itself so that multi-WebComponent setups don't leak across each other's shadow roots (the module-level singleton in helpers/getRootNode.js flips to whichever instance called setRootNode last).
  const localRoot = flyoutRef?.current?.getRootNode?.() || getRootNode();
  // Get the container, toggle element, and target elements
  const appRect = getAppRect(localRoot);
  const referenceElement = localRoot.querySelector(`[data-element="${dataElement}"]`);
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
      flyoutY = referenceButtonRect.bottom - targetElement.clientHeight - appRect.top;
    } else {
      flyoutY = referenceButtonRect.top - targetElement.clientHeight - defaultOffset - appRect.top;
    }

    // This case is for flyouts toggled by elements that are not on a header
  } else if (availableSpaceBelow > targetElement.clientHeight && !parentHeader) {
    flyoutY += referenceButtonRect.height + defaultOffset;
  }

  return { x: flyoutX, y: flyoutY };
}

/**
 * Returns true when the toggle button's rect lies outside the visible client rect of the element that just scrolled.
 *
 * Used to determine if a flyout should be closed after a scroll event, e.g. if scrolling the element moves the
 * toggle off-screen (e.g. behind a NotesPanelHeader or below the panel's bottom edge), then the flyout should close
 * otherwise it will float over the element that's supposed to be hiding the toggle.
 * @param {*} toggle The flyout toggle button element
 * @param {*} scrolledTarget The element that just emitted a scroll event
 * @returns {boolean} Returns true when the toggle button's rect lies outside the visible client rect of the element that just scrolled
 * @ignore
 */
export function isToggleScrolledOutOfAncestor(toggle, scrolledTarget) {
  if (scrolledTarget?.nodeType !== 1 || !scrolledTarget.contains(toggle)) {
    return false;
  }
  const toggleRect = toggle.getBoundingClientRect();
  const scrollRect = scrolledTarget.getBoundingClientRect();
  const isScrolledOut = toggleRect.bottom <= scrollRect.top
    || toggleRect.top >= scrollRect.bottom
    || toggleRect.right <= scrollRect.left
    || toggleRect.left >= scrollRect.right;
  return isScrolledOut;
}