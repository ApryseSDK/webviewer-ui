/**
 * Load a document inside WebViewer UI.
 * @method UI.loadDocument
 * @param {(string|File|Blob|Core.Document|Core.PDFNet.PDFDoc)} documentPath Path to the document OR <a href='https://developer.mozilla.org/en-US/docs/Web/API/File' target='_blank'>File object</a> if opening local file.
 * @param {object} [options] Additional options
 * @param {string} [options.extension] The extension of the file. If file is a blob/file object or a URL without an extension then this is necessary so that WebViewer knows what type of file to load.
 * @param {string} [options.filename] Filename of the document, which is used when downloading the PDF.
 * @param {object} [options.customHeaders] An object of custom HTTP headers to use when retrieving the document from the specified url.
 * @param {object} [options.webViewerServerCustomQueryParameters] An object of custom query parameters to be appended to every WebViewer Server request.
 * @param {string} [options.documentId] Unique id of the document.
 * @param {boolean} [options.withCredentials] Whether or not cross-site requests should be made using credentials.
 * @param {string} [options.cacheKey] A key that will be used for caching the document on WebViewer Server.
 * @param {string} [options.password] A string that will be used to as the password to load a password protected document.
 * @param {object} [options.xodOptions] - An object that contains the options for a XOD document.
 * @param {boolean} [options.xodOptions.decrypt] - Function to be called to decrypt a part of the XOD file. For default XOD AES encryption pass Core.Encryption.decrypt.
 * @param {boolean} [options.xodOptions.decryptOptions] -  An object with options for the decryption e.g. {p: "pass", type: "aes"} where is p is the password.
 * @param {boolean} [options.xodOptions.streaming] - A boolean indicating whether to use http or streaming PartRetriever, it is recommended to keep streaming false for better performance. https://www.pdftron.com/documentation/web/guides/streaming-option.
 * @param {boolean} [options.xodOptions.azureWorkaround] - Whether or not to workaround the issue of Azure not accepting range requests of a certain type. Enabling the workaround will add an extra HTTP request of overhead but will still allow documents to be loaded from other locations.
 * @param {boolean} [options.xodOptions.startOffline] - Whether to start loading the document in offline mode or not. This can be set to true if the document had previously been saved to an offline database using WebViewer APIs. You'll need to use this option to load from a completely offline state.
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
