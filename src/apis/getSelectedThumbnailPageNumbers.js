/**
 * Get the currently selected pages
 * @method UI.getSelectedThumbnailPageNumbers
 * @return {Array<number>} an array of select page numbers
 * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
    instance.UI.getSelectedThumbnailPageNumbers();
  });
 */
import selectors from 'selectors';

export default store => () => selectors.getSelectedThumbnailPageIndexes(store.getState()).map(pageIndex => pageIndex + 1);