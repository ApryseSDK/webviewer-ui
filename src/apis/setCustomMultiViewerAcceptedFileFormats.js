import actions from 'actions';

/**
 * @callback CustomMultiViewerAcceptedFileFormats
 * @memberof UI
 * @param {Array<string>} acceptedFileFormats The file formats to support when accepting files in multiviewer mode
 */

/**
 * @method UI.setCustomMultiViewerAcceptedFileFormats
 * @param {UI.CustomMultiViewerAcceptedFileFormats} customMultiViewerAcceptedFileFormats
 * @example
 WebViewer(...)
  .then(function(instance) {
    instance.UI.setCustomMultiViewerAcceptedFormats(['pdf']);
  });
 */

export default (store) => (customMultiViewerAcceptedFileFormats) => {
  store.dispatch(actions.setCustomMultiViewerAcceptedFileFormats(customMultiViewerAcceptedFileFormats));
};