import actions from 'actions';
import selectors from 'selectors';

/**
 * @method UI.enableMultiViewerSync
 * @param {number} [primaryViewerKey=1] Which DocumentViewer to set as primary for initial zoom sync (1 or 2)
 * @example
 WebViewer(...)
 .then((instance) => {
    instance.UI.enableMultiViewerSync(1) // Value can be 1 (for left side) or 2 (for right side)
  });
 */
const enableMultiViewerSync = (store) => (primaryViewerKey) => {
  if (!primaryViewerKey || (primaryViewerKey !== 1 && primaryViewerKey !== 2)) {
    primaryViewerKey = 1;
  }
  store.dispatch(actions.setSyncViewer(primaryViewerKey));
};

/**
 * @method UI.disableMultiViewerSync
 * @example
 WebViewer(...)
 .then((instance) => {
    instance.UI.disableMultiViewerSync();
  });
 */
const disableMultiViewerSync = (store) => () => {
  store.dispatch(actions.setSyncViewer(null));
};

/**
 * @method UI.isMultiViewerSyncing
 * @return {boolean} returns true if sync is enabled false if disabled
 * @example
 WebViewer(...)
 .then((instance) => {
    console.log(instance.UI.isMultiViewerSyncing());
  });
 */
const isMultiViewerSyncing = (store) => () => !!selectors.getSyncViewer(store.getState());

export {
  isMultiViewerSyncing,
  enableMultiViewerSync,
  disableMultiViewerSync,
};