/**
 * Load a document inside WebViewer UI.
 * @method WebViewer#loadDocument
 * @param {(string|File)} documentPath Path to the document OR <a href='https://developer.mozilla.org/en-US/docs/Web/API/File' target='_blank'>File object</a> if opening local file.
 * @param {object} options Additional options
 * @param {string} options.documentId Unique id of the document.
 * @param {string} options.filename Filename of the document, which is used when downloading the PDF.
 * @param {object} options.customHeaders An object custom HTTP headers to use when retrieving the document from the specified url.
 * @param {boolean} options.withCredentials Whether or not cross-site requests should be made using credentials.
 * @param {string} options.cacheKey A key that will be used for caching the document on WebViewer Server.
 * @param {string} options.password A string that will be used to as the password to load a password protected document.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.loadDocument('https://www.pdftron.com/downloads/pl/test.pdf', {
      documentId: '1',
      filename: 'sample-1.pdf'
    });
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.loadDocument('https://www.pdftron.com/downloads/pl/test.pdf', {
    documentId: '1',
    filename: 'sample-1.pdf'
  });
});
 */

import loadDocument from 'helpers/loadDocument';
import actions from 'actions';

export default store => (documentPath, options = {}) => {
  const {
    documentId = null,
    streaming = false,
    filename = null,
    extension = null,
    decrypt = null,
    decryptOptions = {},
    customHeaders = {},
    withCredentials = false,
    cacheKey = null,
    password = '',
  } = options;

  store.dispatch(actions.setDocumentId(documentId));
  store.dispatch(actions.setStreaming(streaming));
  store.dispatch(actions.setDecryptFunction(decrypt));
  store.dispatch(actions.setDecryptOptions(decryptOptions));
  store.dispatch(actions.setFilename(filename));
  store.dispatch(actions.setExtension(extension));
  store.dispatch(actions.setCustomHeaders(customHeaders));
  store.dispatch(actions.setWithCredentials(withCredentials));
  store.dispatch(actions.setPassword(password));
  store.dispatch(actions.setCacheKey(cacheKey));

  if (window.CoreControls.isFullPDFEnabled() && documentPath instanceof window.PDFNet.PDFDoc) {
    store.dispatch(actions.setPDFDoc(documentPath));
  } else if (typeof documentPath === 'object') {
    store.dispatch(actions.setDocumentFile(documentPath));
  } else {
    store.dispatch(actions.setDocumentPath(documentPath));
  }
  loadDocument(store.getState(), store.dispatch);
};
