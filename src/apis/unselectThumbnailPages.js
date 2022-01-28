/**
 * Unselect selected thumbnails
 * @method UI.unselectThumbnailPages
 * @param {Array<number>} pageNumbers array of page numbers to unselect
 * @example // 6.1 and after
WebViewer(...)
  .then(function(instance) {
    const pageNumbersToUnselect = [1, 2];
    instance.UI.unselectThumbnailPages(pageNumbersToUnselect);
  });
 */
import selectors from 'selectors';
import actions from 'actions';

export default store => pageNumbers => {
  const selectedIndex = selectors.getSelectedThumbnailPageIndexes(store.getState());

  if (!pageNumbers || !Array.isArray(pageNumbers)) {
    console.warn(`Invalid input, 'unselectThumbnailPages' expect an array of numbers`);
    return;
  }

  store.dispatch(actions.setSelectedPageThumbnails(selectedIndex.filter(i => !pageNumbers.includes(i + 1))));
};