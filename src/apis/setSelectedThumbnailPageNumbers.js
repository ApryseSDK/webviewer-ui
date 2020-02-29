/**
 * Sets the currently selected pages
 * @method WebViewerInstance#setSelectedThumbnailPageNumbers
 * @param {Array.<number>} selectedThumbnailPageNumbers an array of select page numbers
 * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
    instance.setSelectedThumbnailPageNumbers([1, 2, 3]);
  });
 */

import actions from 'actions';

export default store => selectedThumbnailPageNumbers => {
  store.dispatch(actions.setSelectedPageThumbnails(selectedThumbnailPageNumbers));
};