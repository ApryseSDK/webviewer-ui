/**
 * Downloads the pdf document with or without annotations added by WebViewer UI.
 * @method WebViewerInstance#downloadPdf
 * @param {boolean} [includeAnnotations=true] Whether or not to include annotations added by WebViewer UI.
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      // download pdf without annotations added by WebViewer UI
      instance.downloadPdf(false);
    });
  });
 */

import downloadPdf from 'helpers/downloadPdf';
import { workerTypes } from 'constants/types';
import core from 'core';

export default store => (includeAnnotations = true) => {
  const documentType = core.getDocument()?.getType();
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
    includeAnnotations,
  });
};
