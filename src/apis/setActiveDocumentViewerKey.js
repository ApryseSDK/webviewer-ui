/**
 * Sets the active document viewer in Multi-Viewer Mode.
 * Fires the UI.Events.ACTIVE_DOCUMENT_VIEWER_CHANGED event when the active viewer changes.
 * @method UI.setActiveDocumentViewerKey
 * @param {number} documentViewerKey The key of the document viewer to make active
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enterMultiViewerMode();

    // Listen for active document viewer changes
    instance.UI.addEventListener(instance.UI.Events.ACTIVE_DOCUMENT_VIEWER_CHANGED, (e) => {
      console.log('Active viewer changed from', e.detail.previousDocumentViewerKey, 'to', e.detail.activeDocumentViewerKey);
    });

    // Set the active document viewer to the second viewer
    instance.UI.setActiveDocumentViewerKey(2);
  });
 */

import actions from 'actions';
import selectors from 'selectors';
import fireActiveDocumentViewerChanged from 'helpers/fireActiveDocumentViewerChanged';

export default (store) => (documentViewerKey) => {
  const state = store.getState();
  const isMultiViewerMode = selectors.isMultiViewerMode(state);

  if (!isMultiViewerMode) {
    console.warn('setActiveDocumentViewerKey: Multi-Viewer Mode is not enabled');
    return;
  }

  const { TYPES, checkTypes } = window.Core;

  checkTypes([documentViewerKey], [TYPES.ONE_OF(1, 2)], 'UI.setActiveDocumentViewerKey');

  const previousDocumentViewerKey = selectors.getActiveDocumentViewerKey(state);

  const isViewerKeyChanging = previousDocumentViewerKey !== documentViewerKey;

  if (isViewerKeyChanging) {
    store.dispatch(actions.setActiveDocumentViewerKey(documentViewerKey));

    fireActiveDocumentViewerChanged(previousDocumentViewerKey, documentViewerKey);
  }
};
