import selectors from 'selectors';
import actions from 'actions';

/**
 * An instance of TabManager that can be used to edit the open document Tabs **Only Multi-Tab Mode**.
 * @namespace TabManager
 * @memberof UI
 * @example
 WebViewer(...)
 .then(function (instance) {
    instance.UI.TabManager.setActiveTab(0);
  })
 */

export default (store) => Object.create(TabManagerAPI).initialize(store);

const TabManagerAPI = {
  initialize(store) {
    this.store = store;
    return this;
  },
  /**
   * Set the currently open tab in the UI
   * @method UI.TabManager.setActiveTab
   * @param {number} tabId The tab id to set as the current tab
   * @param {boolean} [saveCurrentActiveTabState] Whether to save the current tab annotations, scroll position, and zoom level before switching to the new tab (default: true)
   * @returns {Promise<void>} Resolves when the tab is loaded
   * @example
   * WebViewer(...).then(function(instance) {
   *   instance.UI.TabManager.setActiveTab(0, false); // Set to tab id 0 discarding current tab state
   * });
   */
  async setActiveTab(tabId, saveCurrentActiveTabState = true) {
    const tabManager = selectors.getTabManager(this.store.getState());
    await tabManager.setActiveTab(tabId, saveCurrentActiveTabState);
  },
  /**
   * Delete a tab by id in the UI
   * @method UI.TabManager.deleteTab
   * @param {number} tabId The tab id to be deleted from the tab header
   * @returns {void}
   * @example
   * WebViewer(...).then(function(instance) {
   *   instance.UI.TabManager.deleteTab(0); // Delete tab id 0
   * });
   */
  deleteTab(tabId) {
    const tabManager = selectors.getTabManager(this.store.getState());
    tabManager.deleteTab(tabId);
  },

  /**
   * Add a new tab to the UI
   * @method UI.TabManager.addTab
   * @param {(string|File|Blob|Core.Document|Core.PDFNet.PDFDoc)} src The source of the tab to be added (e.g. a URL, a blob, ArrayBuffer, or a File)
   * @param {UI.loadDocumentOptions} [options] The options for the tab to be added
   * @param {boolean} [options.setActive] Whether to set the new tab as active immediately after adding it (default: true)
   * @param {boolean} [options.saveCurrentActiveTabState] Whether to save the current tab annotations, scroll position, and zoom level before adding the new tab (only used when setActive=true) (default: true)
   * @param {string} [options.extension] The extension of the file. If file is a blob/file object or a URL without an extension then this is necessary so that WebViewer knows what type of file to load.
   * @param {string} [options.filename] Filename of the document, which is used when downloading the PDF.
   * @param {object} [options.customHeaders] An object of custom HTTP headers to use when retrieving the document from the specified url.
   * @param {object} [options.webViewerServerCustomQueryParameters] An object of custom query parameters to be appended to every WebViewer Server request.
   * @param {string} [options.documentId] Unique id of the document.
   * @param {boolean} [options.withCredentials] Whether or not cross-site requests should be made using credentials.
   * @param {string} [options.cacheKey] A key that will be used for caching the document on WebViewer Server.
   * @param {object} [options.officeOptions] An object that contains the options for an Office document.
   * @param {object} [options.rasterizerOptions] An object that contains the rasterizer options for WebViewer Server.
   * @param {Core.TemplateData} [options.officeOptions.templateValues] If set, will perform template replacement with the data specified by this parameter.
   * @param {Core.TemplateOptions} [options.officeOptions.templateOptions] If set, it will interpret the office document as a template document and compile all of the template tags in the document using the provided options.
   * @param {boolean} [options.officeOptions.doTemplatePrep] If set, it will interpret the office document as a template document and compile all of the template tags in the document.
   * @param {boolean} [options.officeOptions.disableBrowserFontSubstitution] By default, office viewing takes a lightweight approach to font substitution, allowing the browser to select fonts when they are not embedded in the document itself.
   * While this means that WebViewer has access to all the fonts on the user's system, it also means that an office document may have a different "look" on different systems (depending on the fonts available) and when it is converted to PDF (as the PDF conversion routine cannot obtain low-level access to user fonts, for security reasons).
   * disableBrowserFontSubstitution prevents this browser substitution, forcing the WebViewer backend to handle all fonts. This means that viewing and conversion to PDF will be 100% consistent from system-to-system, at the expense of a slightly slower initial viewing time and higher bandwidth usage.
   * Using https://docs.apryse.com/documentation/web/faq/self-serve-substitute-fonts/ along with this option allows you to fully customize the substitution behaviour for all office files.
   * @param {object} [options.officeOptions.formatOptions] An object that contains formatting options for an Office document. Same options as allowed here {@link Core.PDFNet.Convert.OfficeToPDFOptions}.
   * @param {boolean} [options.officeOptions.formatOptions.hideTotalNumberOfPages] If true will hide total number of pages from page number labels (i.e, Page 1, Page 2, vs Page 1 of 2, Page 2 of 2)
   * @param {boolean} [options.officeOptions.formatOptions.applyPageBreaksToSheet] If true will split Excel worksheets into pages so that the output resembles print output.
   * @param {boolean} [options.officeOptions.formatOptions.displayChangeTracking] If true will display office change tracking markup present in the document (i.e, red strikethrough of deleted content and underlining of new content). Otherwise displays the resolved document content, with no markup. Defaults to true.
   * @param {boolean} [officeOptions.formatOptions.displayHiddenText] If true will display hidden text in document. Otherwise hidden text will not be shown. Defaults to false.
   * @param {number} [options.officeOptions.formatOptions.excelDefaultCellBorderWidth] Cell border width for table cells that would normally be drawn with no border. In units of points. Can be used to achieve a similar effect to the "show gridlines" display option within Microsoft Excel.
   * @param {number} [options.officeOptions.formatOptions.excelMaxAllowedCellCount] An exception will be thrown if the number of cells in an Excel document is above the value. Used for early termination of resource intensive documents. Setting this value to 250000 will allow the vast majority of Excel documents to convert without issue, while keeping RAM usage to a reasonable level. By default there is no limit to the number of allowed cells.
   * @param {string} [options.officeOptions.formatOptions.locale] Sets the value for Locale in the options object ISO 639-1 code of the current system locale. For example: 'en-US', 'ar-SA', 'de-DE', etc.
   * @param {boolean} [options.enableOfficeEditing] If true, will load docx files with editing capabilities.
   * @param {string} [options.password] A string that will be used to as the password to load a password protected document.
   * @param {function} [options.onError] - A callback function that will be called when error occurs in the process of loading a document. The function signature is `function(e) {}`
   * @param {object} [options.xodOptions] - An object that contains the options for a XOD document.
   * @param {boolean} [options.xoddecrypt] - Function to be called to decrypt a part of the XOD file. For default XOD AES encryption pass Core.Encryption.decrypt.
   * @param {boolean} [options.xoddecryptOptions] -  An object with options for the decryption e.g. {p: "pass", type: "aes"} where is p is the password.
   * @param {boolean} [options.xodstreaming] - A boolean indicating whether to use http or streaming PartRetriever, it is recommended to keep streaming false for better performance. https://docs.apryse.com/documentation/web/guides/streaming-option/.
   * @param {boolean} [options.xodazureWorkaround] - Whether or not to workaround the issue of Azure not accepting range requests of a certain type. Enabling the workaround will add an extra HTTP request of overhead but will still allow documents to be loaded from other locations.
   * @param {boolean} [options.xodstartOffline] - Whether to start loading the document in offline mode or not. This can be set to true if the document had previously been saved to an offline database using WebViewer APIs. You'll need to use this option to load from a completely offline state.
   * @returns {Promise<number>} Resolves to the tab id of the newly added tab
   * @example
   * WebViewer(...).then(function(instance) {
   *   // Adding a new tab with the URL http://www.example.com
   *   instance.UI.TabManager.addTab(
   *      'http://www.example.com/pdf',
   *      {
   *        extension: "pdf",
   *        filename: 'Example',
   *        withCredentials: true,
   *        setActive: true,
   *        saveCurrentActiveTabState: true
   *      }
   *    );
   * });
   */
  async addTab(src, options) {
    const tabManager = selectors.getTabManager(this.store.getState());
    return tabManager.addTab(src, options);
  },
  /**
   * Get the currently active tab id
   * @method UI.TabManager.getActiveTab
   * @returns {object} The current tab with the following properties: { id: Number, options: Object, src: string|Blob|File|ArrayBuffer }
   */
  getActiveTab() {
    const state = this.store.getState();
    const activeTab = selectors.getActiveTab(state);
    const tabs = selectors.getTabs(state);
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    return {
      id: currentTab.id,
      options: currentTab.options,
      src: currentTab.src,
    };
  },
  /**
   * Get all the tabs from the UI
   * @method UI.TabManager.getAllTabs
   * @returns {Array<Object>} Array of tab objects containing the following properties: { id: Number, options: Object, src: string|Blob|File|ArrayBuffer }
   */
  getAllTabs() {
    const tabManager = selectors.getTabManager(this.store.getState());
    return tabManager.map((tab) => ({
      id: tab.id,
      options: tab.options,
      src: tab.src,
    }));
  },
  /**
   * Disable the warning when deleting a tab in multi-tab mode
   * @method UI.TabManager.disableDeleteTabWarning
   * @example
   * WebViewer(...)
   *   .then(function (instance) {
   *     instance.UI.TabManager.disableDeleteTabWarning();
   *   });
   */
  disableDeleteTabWarning() {
    this.store.dispatch(actions.disableDeleteTabWarning());
  },
};
