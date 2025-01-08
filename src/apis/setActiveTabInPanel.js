/**
 * Set an active tab inside of a tab panel.
 * @method UI.setActiveTabInPanel
 * @param {Object} options - The options for selecting the active tab inside a tab panel
 * @param {string} options.tabPanel - The identifier for the tab panel where the tab is located.
 * @param {string} options.tabName - The name of the tab to activate.
 * @example
 * WebViewer(...)
 *   .then(function(instance) {
 *     // open left panel
 *     instance.UI.openElements(['leftPanel']);
 *     // view outlines panel
 *     instance.UI.setActiveTabInPanel({ tabPanel: 'leftPanel', tabName: 'outlinesPanel' });
 *   });
 */

import actions from 'actions';
const { checkTypes, TYPES } = window.Core;
export default (store) => ({ tabPanel, tabName }) => {
  checkTypes([tabPanel, tabName], [TYPES.STRING, TYPES.STRING], 'setActiveTabInPanel');
  store.dispatch(actions.setActiveTabInPanel(tabName, tabPanel));
};