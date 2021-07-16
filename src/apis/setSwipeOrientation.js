/**
 * Sets the swipe orientation between pages of WebViewer UI on mobile devices. Default is horizontal.
 * @method UI.setSwipeOrientation
 * @param {string} swipeOrientation The swipe orientation to navigate between pages. Available orientations are: horizontal, vertical and both.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setSwipeOrientation('vertical'); // set the swipe orientation to vertical.
  });
 */
import TouchEventManager from 'helpers/TouchEventManager';

export default swipeOrientation => {
  if (swipeOrientation === 'both') {
    TouchEventManager.allowVerticalSwipe = true;
    TouchEventManager.allowHorizontalSwipe = true;
  } else if (swipeOrientation === 'vertical') {
    TouchEventManager.allowVerticalSwipe = true;
    TouchEventManager.allowHorizontalSwipe = false;
  } else if (swipeOrientation === 'horizontal') {
    TouchEventManager.allowVerticalSwipe = false;
    TouchEventManager.allowHorizontalSwipe = true;
  } else {
    console.warn(`${swipeOrientation} is not a valid orientation. Try 'vertical,' 'horizontal,' or 'both.`);
  }
};