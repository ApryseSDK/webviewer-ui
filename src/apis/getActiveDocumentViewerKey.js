/**
 * Returns the key of the currently active document viewer in Multi-Viewer Mode.
 * Returns 1 if not in Multi-Viewer Mode.
 * @method UI.getActiveDocumentViewerKey
 * @returns {number} The key of the active document viewer
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enterMultiViewerMode();
    const activeKey = instance.UI.getActiveDocumentViewerKey();
    console.log(activeKey);
  });
 */

import selectors from 'selectors';

export default (store) => () => selectors.getActiveDocumentViewerKey(store.getState());
