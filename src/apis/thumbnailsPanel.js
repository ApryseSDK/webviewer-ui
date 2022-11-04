import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import thumbnailSelectionModes from 'constants/thumbnailSelectionModes';

/**
 * @namespace UI.ThumbnailsPanel
 */

/**
 * Enable multi select in the left thumbnail panel
 * @method UI.ThumbnailsPanel.enableMultiselect
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.ThumbnailsPanel.enableMultiselect();
  });
 */
const enableMultiselect = (store) => () => {
  store.dispatch(actions.setThumbnailSelectingPages(true));
};

/**
 * Disable multi select in the left thumbnail panel
 * @method UI.ThumbnailsPanel.disableMultiselect
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.ThumbnailsPanel.disableMultiselect();
  });
 */
const disableMultiselect = (store) => () => {
  store.dispatch(actions.setThumbnailSelectingPages(false));
};

/**
 * Select thumbnails in the thumbnail panel. This requires the "ThumbnailMultiselect" feature to be enabled
 * @method UI.ThumbnailsPanel.selectPages
 * @param {Array<number>} pageNumbers array of page numbers to select
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableFeatures(['ThumbnailMultiselect']);

    const pageNumbersToSelect = [1, 2, 3];
    instance.UI.ThumbnailsPanel.selectPages(pageNumbersToSelect);
  });
 */
const selectPages = (store) => (pageNumbers) => {
  const multiSelectEnable = selectors.isThumbnailMultiselectEnabled(store.getState());

  if (!multiSelectEnable) {
    console.warn('Thumbnail multiselect is not enabled');
    return;
  }

  if (!pageNumbers || !Array.isArray(pageNumbers)) {
    console.warn('Invalid input, \'selectThumbnailPages\' expect an array of numbers');
    return;
  }

  const selectedIndex = selectors.getSelectedThumbnailPageIndexes(store.getState());
  const selectedPages = selectedIndex.map((index) => index + 1);

  const pageCount = core.getTotalPages();
  const alreadySelected = pageNumbers.filter((pageNumber) => selectedPages.includes(pageNumber));
  if (alreadySelected.length) {
    console.warn(`The following pages were already selected: ${alreadySelected.join(', ')}`);
  }

  const outOfRangePages = pageNumbers.filter((pageNumber) => pageNumber < 1 || pageNumber > pageCount);
  if (outOfRangePages.length) {
    console.warn(`The following pages are out of range: ${outOfRangePages.join(', ')}`);
  }

  let pagesToSelect = pageNumbers.filter(
    (pageNumber) => pageNumber >= 1 && pageNumber <= pageCount && !selectedPages.includes(pageNumber) && !isNaN(pageNumber),
  );

  pagesToSelect = pagesToSelect.filter(function(page, index, self) {
    return self.indexOf(page) === index;
  });

  store.dispatch(actions.setSelectedPageThumbnails([...selectedIndex, ...pagesToSelect.map((page) => page - 1)]));
};

/**
 * Unselect selected thumbnails
 * @method UI.ThumbnailsPanel.unselectPages
 * @param {Array<number>} pageNumbers array of page numbers to unselect
 * @example
WebViewer(...)
  .then(function(instance) {
    const pageNumbersToUnselect = [1, 2];
    instance.UI.ThumbnailsPanel.unselectPages(pageNumbersToUnselect);
  });
 */
const unselectPages = (store) => () => {
  store.dispatch(actions.setNotesPanelRepliesCollapsing(false));
};

/**
 * Get the currently selected pages
 * @method UI.ThumbnailsPanel.getSelectedPageNumbers
 * @return {Array<number>} an array of select page numbers
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.ThumbnailsPanel.getSelectedPageNumbers();
  });
 */
const getSelectedPageNumbers = (store) => () => selectors.getSelectedThumbnailPageIndexes(store.getState()).map((pageIndex) => pageIndex + 1);

/**
 * Sets thumbnail selection mode.
 * @method UI.ThumbnailsPanel.setThumbnailSelectionMode
 * @param {string} thumbnailSelectionMode Thumbnail selection mode to set
 * @param {string} thumbnailSelectionMode.thumbnail Set selection mode to use entire thumbnail to select a page
 * @param {string} thumbnailSelectionMode.checkbox (default) Set selection mode to use only checkbox to select a page
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.ThumbnailsPanel.setThumbnailSelectionMode('thumbnail');
  });
 */

const setThumbnailSelectionMode = (store) => (thumbnailSelectionMode) => {
  if (Object.values(thumbnailSelectionModes).indexOf(thumbnailSelectionMode) > -1) {
    store.dispatch(actions.setThumbnailSelectionMode(thumbnailSelectionMode));
  } else {
    console.error(`Thumbnail Selection Mode must be one of: "${Object.values(thumbnailSelectionModes).join('", "')}"`);
  }
};

export {
  enableMultiselect,
  disableMultiselect,
  selectPages,
  unselectPages,
  getSelectedPageNumbers,
  setThumbnailSelectionMode,
};
