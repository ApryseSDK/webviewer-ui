/**
 * Sets page labels that will be displayed in UI. You may want to use this API if the document's page labels start with characters/numbers other than 1.
 * @method UI.setPageLabels
 * @param {Array.<string>} pageLabels Page labels that will be displayed in UI.
 * @param {number} [documentViewerKey] The document viewer key of the document you want to set page labels for. Defaults to the active viewer.
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      instance.UI.setPageLabels(['i', 'ii', 'iii', '4', '5']); // assume a document has 5 pages
    });
  });
 */

import actions from 'actions';
import core from 'core';
import selectors from 'selectors';

export default (store) => (pageLabels, documentViewerKey) => {
  const { checkTypes, TYPES } = window.Core;
  checkTypes([pageLabels], [TYPES.ARRAY(TYPES.STRING)], 'UI.setPageLabels');

  const state = store.getState();
  documentViewerKey = documentViewerKey || selectors.getActiveDocumentViewerKey(state);

  const hasDuplicates = (arr) => new Set(arr).size !== arr.length;

  if (hasDuplicates(pageLabels)) {
    throw new Error('UI.setPageLabels: Duplicate page labels are not allowed.');
  }

  store.dispatch(actions.setPageLabels(pageLabels, documentViewerKey));
  const labelsCountMatchesTotal = pageLabels.length === core.getTotalPages(documentViewerKey);
  if (labelsCountMatchesTotal) {
    store.dispatch(actions.enableCustomPageLabels(documentViewerKey));
  }
};