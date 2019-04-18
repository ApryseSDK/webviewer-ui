/**
 * Downloads the pdf document with or without annotations added by WebViewer UI.
 * @method WebViewer#downloadPdf
 * @param {boolean} [includeAnnotations=true] Whether or not to include annotations added by WebViewer UI.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

// download pdf without annotations added by WebViewer UI
instance.downloadPdf(false);
 */

import downloadPdf from 'helpers/downloadPdf';
import selectors from 'selectors';
import { workerTypes } from 'constants/types';

export default store => includeAnnotations => {
  const state = store.getState();
  if (selectors.isElementDisabled(state, 'downloadButton')) {
  console.warn('Download has been disabled.');
    return;
  }
  
  const documentType = selectors.getDocumentType(state);
  const { PDF, BLACKBOX, OFFICE } = workerTypes;
  if (documentType !== PDF && documentType !== OFFICE && documentType !== BLACKBOX) {
  console.warn('Document type is not PDF. Cannot be downloaded.');
    return;
  }
  downloadPdf(store.dispatch, {
    documentPath: selectors.getDocumentPath(state),
    filename: state.document.filename,
    includeAnnotations
  });
};