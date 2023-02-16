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

export default (store) => (src, options) => {
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
 * @property {object} [officeOptions] An object that contains the options for an Office document.
 * @property {object} [rasterizerOptions] An object that contains the rasterizer options for WebViewer Server.
 * @property {Core.TemplateData} [officeOptions.templateValues] If set, will perform template replacement with the data specified by this parameter
 * @property {boolean} [officeOptions.doTemplatePrep] If set, it will interpret the office document as a template document and compile all of the template tags in the document
 * @property {boolean} [officeOptions.disableBrowserFontSubstitution] By default, office viewing takes a lightweight approach to font substitution, allowing the browser to select fonts when they are not embedded in the document itself.
 * While this means that WebViewer has access to all the fonts on the user's system, it also means that an office document may have a different "look" on different systems (depending on the fonts available) and when it is converted to PDF (as the PDF conversion routine cannot obtain low-level access to user fonts, for security reasons).
 * disableBrowserFontSubstitution prevents this browser substitution, forcing the WebViewer backend to handle all fonts. This means that viewing and conversion to PDF will be 100% consistent from system-to-system, at the expense of a slightly slower initial viewing time and higher bandwidth usage.
 * Using https://www.pdftron.com/documentation/web/faq/self-serve-substitute-fonts/ along with this option allows you to fully customize the substitution behaviour for all office files.
 * @property {object} [officeOptions.formatOptions] An object that contains formatting options for an Office document. Same options as allowed here {@link Core.PDFNet.Convert.OfficeToPDFOptions}.
 * @property {boolean} [officeOptions.formatOptions.applyPageBreaksToSheet] If true will split Excel worksheets into pages so that the output resembles print output.
 * @property {boolean} [officeOptions.formatOptions.displayChangeTracking] If true will display office change tracking markup present in the document (i.e, red strikethrough of deleted content and underlining of new content). Otherwise displays the resolved document content, with no markup. Defaults to true.
 * @property {number} [officeOptions.formatOptions.excelDefaultCellBorderWidth] Cell border width for table cells that would normally be drawn with no border. In units of points. Can be used to achieve a similar effect to the "show gridlines" display option within Microsoft Excel.
 * @property {number} [officeOptions.formatOptions.excelMaxAllowedCellCount] An exception will be thrown if the number of cells in an Excel document is above the value. Used for early termination of resource intensive documents. Setting this value to 250000 will allow the vast majority of Excel documents to convert without issue, while keeping RAM usage to a reasonable level. By default there is no limit to the number of allowed cells.
 * @property {string} [officeOptions.formatOptions.locale] Sets the value for Locale in the options object ISO 639-1 code of the current system locale. For example: 'en-US', 'ar-SA', 'de-DE', etc.
 * @property {string} [password] A string that will be used to as the password to load a password protected document.
 * @property {function} [onError] - A callback function that will be called when error occurs in the process of loading a document. The function signature is `function(e) {}`
 * @property {object} [xodOptions] - An object that contains the options for a XOD document.
 * @property {boolean} [xoddecrypt] - Function to be called to decrypt a part of the XOD file. For default XOD AES encryption pass Core.Encryption.decrypt.
 * @property {boolean} [xoddecryptOptions] -  An object with options for the decryption e.g. {p: "pass", type: "aes"} where is p is the password.
 * @property {boolean} [xodstreaming] - A boolean indicating whether to use http or streaming PartRetriever, it is recommended to keep streaming false for better performance. https://www.pdftron.com/documentation/web/guides/streaming-option.
 * @property {boolean} [xodazureWorkaround] - Whether or not to workaround the issue of Azure not accepting range requests of a certain type. Enabling the workaround will add an extra HTTP request of overhead but will still allow documents to be loaded from other locations.
 * @property {boolean} [xodstartOffline] - Whether to start loading the document in offline mode or not. This can be set to true if the document had previously been saved to an offline database using WebViewer APIs. You'll need to use this option to load from a completely offline state.
 */
