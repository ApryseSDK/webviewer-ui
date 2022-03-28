/**
 * Load a document inside WebViewer UI.
 * @method UI.loadDocument
 * @param {(string|File|Blob|Core.Document|Core.PDFNet.PDFDoc)} documentPath Path to the document OR <a href='https://developer.mozilla.org/en-US/docs/Web/API/File' target='_blank'>File object</a> if opening local file.
 * @param {UI.loadDocumentOptions} [options] Additional options

 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.loadDocument('https://www.pdftron.com/downloads/pl/test.pdf', {
      documentId: '1',
      filename: 'sample-1.pdf'
    });
  });
 */

import loadDocument from 'helpers/loadDocument';

export default store => (src, options) => {
  loadDocument(store.dispatch, src, options);
};

/**
 * @typedef {Object} UI.loadDocumentOptions
 * @property {string} [extension] The extension of the file. If file is a blob/file object or a URL without an extension then this is necessary so that WebViewer knows what type of file to load.
 * @property {string} [filename] Filename of the document, which is used when downloading the PDF.
 * @property {object} [customHeaders] An object of custom HTTP headers to use when retrieving the document from the specified url.
 * @property {object} [webViewerServerCustomQuerypropertyeters] An object of custom query propertyeters to be appended to every WebViewer Server request.
 * @property {string} [documentId] Unique id of the document.
 * @property {boolean} [withCredentials] Whether or not cross-site requests should be made using credentials.
 * @property {string} [cacheKey] A key that will be used for caching the document on WebViewer Server.
 * @property {string} [officeOptions] The options to set when converting office documents.
 * @property {string} [password] A string that will be used to as the password to load a password protected document.
 * @property {function} [onError] - A callback function that will be called when error occurs in the process of loading a document. The function signature is `function(e) {}`
 * @property {object} [xodOptions] - An object that contains the options for a XOD document.
 * @property {boolean} [xoddecrypt] - Function to be called to decrypt a part of the XOD file. For default XOD AES encryption pass Core.Encryption.decrypt.
 * @property {boolean} [xoddecryptOptions] -  An object with options for the decryption e.g. {p: "pass", type: "aes"} where is p is the password.
 * @property {boolean} [xodstreaming] - A boolean indicating whether to use http or streaming PartRetriever, it is recommended to keep streaming false for better performance. https://www.pdftron.com/documentation/web/guides/streaming-option.
 * @property {boolean} [xodazureWorkaround] - Whether or not to workaround the issue of Azure not accepting range requests of a certain type. Enabling the workaround will add an extra HTTP request of overhead but will still allow documents to be loaded from other locations.
 * @property {boolean} [xodstartOffline] - Whether to start loading the document in offline mode or not. This can be set to true if the document had previously been saved to an offline database using WebViewer APIs. You'll need to use this option to load from a completely offline state.
 */