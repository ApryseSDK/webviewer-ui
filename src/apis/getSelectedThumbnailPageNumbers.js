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

export default (store) => () => {
  console.warn('UI.getSelectedThumbnailPageNumbers is deprecated since version 8.5. Please use UI.ThumbnailsPanel.getSelectedPageNumbers instead');

  return selectors.getSelectedThumbnailPageIndexes(store.getState()).map((pageIndex) => pageIndex + 1);
};