import actions from 'actions';

/**
 * Sets reader page mode on WebViewer UI. This means that only one page will be shown
 * at a time in reader mode in single page mode and allows for all pages to be in
 * scrollable view in continuous mode.
 * @method UI.setReaderPageMode
 * @param {string} readerPageMode - Chosen reader page mode. Should be one of the
 * values from UI.ReaderModePageMode.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setReaderPageMode(instance.UI.ReaderModePageMode.SINGLE);
  });
*/
export default (store) => (readerPageMode) => {
  store.dispatch(actions.setReaderPageMode(readerPageMode));
};