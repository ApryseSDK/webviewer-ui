/**
 * Sets page labels that will be displayed in UI. You may want to use this API if the document's page labels start with characters/numbers other than 1.
 * @method UI.setPageLabels
 * @param {Array.<string>} pageLabels Page labels that will be displayed in UI.
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

export default (store) => (pageLabels) => {
  store.dispatch(actions.setPageLabels(pageLabels));
};