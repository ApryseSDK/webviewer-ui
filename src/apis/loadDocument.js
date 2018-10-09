import loadDocument from 'helpers/loadDocument';
import actions from 'actions';

export default store => (documentPath, options = {}) => {
  const { documentId = '', streaming = false, filename = null, decrypt = null, decryptOptions = {}, customHeaders = {} } = options;

  store.dispatch(actions.setDocumentId(documentId));
  store.dispatch(actions.setStreaming(streaming));
  store.dispatch(actions.setDecryptFunction(decrypt));
  store.dispatch(actions.setDecryptOptions(decryptOptions));
  store.dispatch(actions.setFilename(filename));
  store.dispatch(actions.setCustomHeaders(customHeaders));

  if (store.getState().advanced.fullAPI && documentPath instanceof window.PDFNet.PDFDoc) {
    store.dispatch(actions.setPDFDoc(documentPath));
  } else if (typeof documentPath === 'object') {
    store.dispatch(actions.setDocumentFile(documentPath));
  } else {
    store.dispatch(actions.setDocumentPath(documentPath));
  }
  store.dispatch(actions.openElement('loadingModal'));
  loadDocument(store.getState(), store.dispatch);
};