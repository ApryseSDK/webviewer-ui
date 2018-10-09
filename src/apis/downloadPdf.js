import downloadPdf from 'helpers/downloadPdf';
import selectors from 'selectors';
import { documentTypes } from 'constants/types';

export default store => includeAnnotations => {
  const state = store.getState();
  if (selectors.isElementDisabled(state, 'downloadButton')) {
    console.warn('Download has been disabled.');
    return;
  }
  if (selectors.getDocumentType(state) !== documentTypes.PDF && selectors.getDocumentType(state) !== documentTypes.BLACKBOX) {
    console.warn('Document type is not PDF. Cannot be downloaded.');
    return;
  }
  downloadPdf(store.dispatch, state.document.path, state.document.filename, includeAnnotations);
};