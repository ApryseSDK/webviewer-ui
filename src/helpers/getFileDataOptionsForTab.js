/**
 * A map to store file data options for each tab to avoid leaks across tabs.
 * Gets updated by calls to PDFDocument.getFileData.
 * @type {Object<number, object>}
 * @ignore
 */
const FILE_DATA_OPTIONS_MAP = {};

/**
 * A helper function to get the file data options for a given tab
 * @param {number} tabId The tab id
 * @returns {object} The file data options for the tab
 * @ignore
 */
export const getFileDataOptionsForTab = (tabId) => {
  if (!FILE_DATA_OPTIONS_MAP[tabId]) {
    FILE_DATA_OPTIONS_MAP[tabId] = {
      flags: window.Core.SaveOptions.INCREMENTAL,
    };
  }
  return FILE_DATA_OPTIONS_MAP[tabId];
};

/**
 * A helper function to get the file data options for the active tab
 * @param {*} state The redux state
 * @returns {object} The file data options for the active tab
 * @ignore
 */
export const getFileDataOptionsForActiveTab = (state) => {
  const { tabs, activeTab } = state.viewer;
  const currentTab = tabs.find((tab) => tab.id === activeTab);
  return getFileDataOptionsForTab(currentTab.id);
};

/**
 * A helper function to delete the file data options for a given tab
 * @param {number} tabId
 * @ignore
 */
export const deleteFileDataOptionsForTab = (tabId) => {
  delete FILE_DATA_OPTIONS_MAP[tabId];
};