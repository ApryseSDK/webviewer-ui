/**
 * Sets the swipe orientation between pages of WebViewer UI on mobile devices. Default is horizontal.
 * @method WebViewer#setSwipeOrientation
 * @param {string} swipeOrientation The swipe orientation to navigate between pages. Available orientations are: horizontal, vertical and both.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.setSwipeOrientation('vertical'); // set the swipe orientation to vertical.
 */

import actions from 'actions';

export default store => swipeOrientation => {
  store.dispatch(actions.setSwipeOrientation(swipeOrientation));
};