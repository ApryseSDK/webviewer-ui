import selectors from 'selectors';

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


export default store => Object.create(TabManagerAPI).initialize(store);

const TabManagerAPI = {
  initialize(store) {
    this.store = store;
    return this;
  },
  /**
   * Set the currently open tab in the UI
   * @method UI.TabManager.setActiveTab
   * @param tabId {number} The tab id to set as the current tab
   * @param [saveCurrent] {boolean} Whether to save the current tab state before switching to the new tab (default: true)
   * @returns {Promise<void>} Resolves when the tab is loaded
   * @example
   * WebViewer(...).then(function(instance) {
   *   instance.UI.TabManager.setActiveTab(0, false); // Set to tab id 0 discarding current tab state
   * });
   */
  async setActiveTab(tabId, saveCurrent = true) {
    const tabManager = selectors.getTabManager(this.store.getState());
    await tabManager.setActiveTab(tabId, saveCurrent);
  },
  /**
   * Delete a tab by id in the UI
   * @method UI.TabManager.deleteTab
   * @param tabId {number} The tab id to be deleted from the tab header
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
   * @param {boolean} [options.load] Whether to load the tab immediately after adding it (default: true)
   * @param {boolean} [options.saveCurrent] Whether to save the current tab state before adding the new tab (only used when load=true) (default: true)
   * @returns {Promise<number>} Resolves to the tab id of the newly added tab
   * @example
   * WebViewer(...).then(function(instance) {
   *   instance.UI.TabManager.addTab('http://www.example.com/pdf', {extension: "pdf", load: true, saveCurrent: true}); // Add a new tab with the URL http://www.example.com
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
    const currentTab = tabs.find(tab => tab.id === activeTab);
    return {
      id: currentTab.id,
      options: currentTab.options,
      src: currentTab.src,
    };
  },
  /**
   * Get all the tabs from the UI
   * @method UI.TabManager.getTabs
   * @returns {Array<Object>} Array of tab objects containing the following properties: { id: Number, options: Object, src: string|Blob|File|ArrayBuffer }
   */
  getAllTabs() {
    const tabManager = selectors.getTabManager(this.store.getState());
    return tabManager.map(tab => ({
      id: tab.id,
      options: tab.options,
      src: tab.src,
    }));
  },
};
