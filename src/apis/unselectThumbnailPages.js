/**
 * Unselect selected thumbnails
 * @method WebViewerInstance#unselelctThumbnailPages
 * @param {Array<number>} pageNumbers array of page numbers to unselect
 * @example // 6.1 and after
WebViewer(...)
  .then(function(instance) {
    const pageNumbersToUnselect = [1, 2];
    instance.unselelctThumbnailPages(pageNumbersToUnselect);
  });
 */
import selectors from 'selectors';
import actions from 'actions';

export default store => pageNumbers => {
  const selectedIndex = selectors.getSelectedThumbnailPageIndexes(store.getState());

  if (!pageNumbers || !Array.isArray(pageNumbers)) {
    console.warn(`Invalid input, 'unselelctThumbnailPages' expect an array of numbers`);
    return;
  }

  store.dispatch(actions.setSelectedPageThumbnails(selectedIndex.filter(i => !pageNumbers.includes(i + 1))));
};