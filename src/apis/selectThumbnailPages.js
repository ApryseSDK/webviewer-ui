/**
 * Select thumbnails in the thumbnail panel. This requires the "ThumbnailMultiselect" feature to be enabled
 * @method UI.selectThumbnailPages
 * @param {Array<number>} pageNumbers array of page numbers to select
 * @example // 6.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableFeatures(['ThumbnailMultiselect']);

    const pageNumbersToSelect = [1, 2, 3];
    instance.UI.selectThumbnailPages(pageNumbersToSelect);
  });
 */
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';

export default store => pageNumbers => {
  const selectedIndex = selectors.getSelectedThumbnailPageIndexes(store.getState());
  const selectedPages = selectedIndex.map(index => index + 1);

  const pageCount = core.getTotalPages();
  const mutliSelectEnable = selectors.getIsThumbnailMultiselectEnabled(store.getState());

  if (!mutliSelectEnable) {
    console.warn(`Thumbnail multiselect is not enabled`);
    return;
  }

  if (!pageNumbers || !Array.isArray(pageNumbers)) {
    console.warn(`Invalid input, 'selectThumbnailPages' expect an array of numbers`);
    return;
  }

  const alreadySelected = pageNumbers.filter(pageNumber => selectedPages.includes(pageNumber));
  if (alreadySelected.length) {
    console.warn(`The following pages were already selected: ${alreadySelected.join(', ')}`);
  }

  const outOfRangePages = pageNumbers.filter(pageNumber => pageNumber < 1 || pageNumber > pageCount);
  if (outOfRangePages.length) {
    console.warn(`The following pages are out of range: ${outOfRangePages.join(', ')}`);
  }

  let pagesToSelect = pageNumbers.filter(pageNumber => pageNumber >= 1 && pageNumber <= pageCount && !selectedPages.includes(pageNumber) && !isNaN(pageNumber));

  pagesToSelect = pagesToSelect.filter(function(page, index, self) {
    return self.indexOf(page) === index;
  });

  store.dispatch(actions.setSelectedPageThumbnails([...selectedIndex, ...pagesToSelect.map(page => page - 1)]));
};