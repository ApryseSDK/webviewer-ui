/**
 * Downloads the pdf document with or without annotations added by WebViewer UI.
 * @method WebViewer#downloadPdf
 * @param {boolean} [includeAnnotations=true] Whether or not to include annotations added by WebViewer UI.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      // download pdf without annotations added by WebViewer UI
      instance.downloadPdf(false);
    });
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var docViewer = instance.docViewer;

  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', function() {
    // download pdf without annotations added by WebViewer UI
    instance.downloadPdf(false);
  });
});
 */

import downloadPdf from 'helpers/downloadPdf';
import selectors from 'selectors';
import { workerTypes } from 'constants/types';

export default store => includeAnnotations => {
  const state = store.getState();

  const documentType = selectors.getDocumentType(state);
  const { PDF, BLACKBOX, OFFICE } = workerTypes;
  if (
    documentType !== PDF &&
    documentType !== OFFICE &&
    documentType !== BLACKBOX
  ) {
    console.warn('Document type is not PDF. Cannot be downloaded.');
    return;
  }

  downloadPdf(store.dispatch, {
    documentPath: selectors.getDocumentPath(state),
    filename: state.document.filename,
    includeAnnotations,
  });
};
