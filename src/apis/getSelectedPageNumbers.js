/**
 * Get the currently selected pages
 * @method WebViewerInstance#getSelectedThumbnailPageIndexes
 * @return {Array<number>} an arry of select page numbers
 * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
    instance.getSelectedPageNumbers();
  });
 */
import selectors from 'selectors';

export default store => () => selectors.getSelectedThumbnailPageIndexes(store.getState()).map(pageIndex => pageIndex + 1);