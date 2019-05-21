/**
 * Sets the swipe orientation between pages of WebViewer UI on mobile devices. Default is horizontal.
 * @method WebViewer#setSwipeOrientation
 * @param {string} swipeOrientation The swipe orientation to navigate between pages. Available orientations are: horizontal, vertical and both.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.setSwipeOrientation('vertical'); // set the swipe orientation to vertical.
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setSwipeOrientation('vertical'); // set the swipe orientation to vertical.
});
 */

import actions from 'actions';

export default store => swipeOrientation => {
  store.dispatch(actions.setSwipeOrientation(swipeOrientation));
};