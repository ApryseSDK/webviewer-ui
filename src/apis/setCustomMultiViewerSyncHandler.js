import actions from 'actions';

/**
 * @callback CustomMultiViewerSyncHandler
 * @memberof UI
 * @param {number} primaryDocumentViewerKey The primary documentViewerKey to be used when syncing
 * @param {Array<function>} removeHandlerFunctions The event listeners to remove when syncing is finished
 */

/**
 * @method UI.setCustomMultiViewerSyncHandler
 * @param {UI.CustomMultiViewerSyncHandler} customMultiViewerSyncHandler The function that will be invoked when syncing documents in multi viewer mode.
 * @example
 WebViewer(...)
  .then(function(instance) {
    instance.UI.setCustomMultiViewerSyncHandler((primaryDocumentViewerKey, removeHandlerFunctions) => {
      // some code
    })
  });
 */

export default (store) => (customMultiViewerSyncHandler) => {
  store.dispatch(actions.setCustomMultiViewerSyncHandler(customMultiViewerSyncHandler));
};