/**
 * Sets the swipe orientation between pages of WebViewer UI on mobile devices. Default is horizontal.
 * @method WebViewer#setSwipeOrientation
 * @param {string} swipeOrientation The swipe orientation to navigate between pages. Available orientations are: horizontal, vertical and both.
 * @example // set the swipe orientation to vertical.
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setSwipeOrientation('vertical');
});
 */

import actions from 'actions';

export default store => swipeOrientation => {
  store.dispatch(actions.setSwipeOrientation(swipeOrientation));
};