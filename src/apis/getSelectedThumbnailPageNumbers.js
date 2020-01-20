/**
 * Get the currently selected pages
 * @method WebViewerInstance#getSelectedThumbnailPageNumbers
 * @return {Array<number>} an arry of select page numbers
 * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
    instance.getSelectedThumbnailPageNumbers();
  });
 */
import selectors from 'selectors';

export default store => () => selectors.getSelectedThumbnailPageIndexes(store.getState()).map(pageIndex => pageIndex + 1);