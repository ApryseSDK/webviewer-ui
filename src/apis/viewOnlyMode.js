import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import hotkeysManager, {
  Shortcuts,
  setViewOnlyShortcuts,
  getViewOnlyShortcuts as getShortcuts
} from 'helpers/hotkeysManager';

const { checkTypes, TYPES } = window.Core;

const toggleViewOnlyMode = (store, enable) => {
  const isCustomUI = selectors.getIsCustomUIEnabled(store.getState());
  if (!isCustomUI) {
    console.error('View Only Mode can only be toggled when using the Default UI. Please enable the Default UI via WebViewer constructor options.');
  }
  const { dispatch } = store;
  if (enable) {
    core.getFormFieldCreationManager().endFormFieldCreationMode();
    core.getContentEditManager().endContentEditMode();
    core.setToolMode(window.Core.Tools.ToolNames.EDIT); // This will also remove Crop Annotations
    dispatch(actions.setActiveCustomRibbon('toolbarGroup-View'));
  }
  dispatch(actions.closeAllElements());
  dispatch(actions.setViewOnly(enable));
  hotkeysManager.setViewOnlyMode(enable);
};

/**
 * Enables View Only Mode, which disables all editing features in the UI.
 * @method UI.enableViewOnlyMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableViewOnlyMode();
  });
 */
export const enableViewOnlyMode = (store) => () => toggleViewOnlyMode(store, true);

/**
 * Disables View Only Mode, allowing editing features to be used in the UI.
 * @method UI.disableViewOnlyMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.disableViewOnlyMode();
  });
 */
export const disableViewOnlyMode = (store) => () => toggleViewOnlyMode(store, false);

/**
 * Adds an element to the view-only whitelist, which makes the element visible and usable in view-only mode.
 * @method UI.addToViewOnlyWhitelist
 * @param {Array.<string>} dataElements Array of data-element attribute values for DOM elements to whitelist in view-only mode. To find data-element of a DOM element, refer to <a href='https://docs.apryse.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>. * @example
 WebViewer(...)
 .then(function(instance) {
 instance.UI.addToViewOnlyWhitelist(['toolbarGroup-View']);
 });
 */
export const addToViewOnlyWhitelist = (store) => (dataElements) => {
  checkTypes([dataElements], [TYPES.MULTI_TYPE(TYPES.STRING, TYPES.ARRAY(TYPES.STRING))], 'UI.addToViewOnlyWhitelist');
  dataElements = Array.isArray(dataElements) ? dataElements : [dataElements];
  const newWhiteList = [...store.getState().viewer.viewOnlyWhitelist.dataElement, ...dataElements];
  store.dispatch(actions.updateViewOnlyWhitelist(newWhiteList));
  const newBlackList = store.getState().viewer.viewOnlyWhitelist.dataElementBlacklist.filter((el) => !dataElements.includes(el));
  store.dispatch(actions.updateViewOnlyBlacklist(newBlackList));
};

/**
 * Removes an element from the view-only whitelist, which makes the element hidden or disabled in view-only mode.
 * @method UI.removeFromViewOnlyWhitelist
 * @param {Array.<string>} dataElements Array of data-element attribute values for DOM elements to remove from the view-only whitelist. To find data-element of a DOM element, refer to <a href='https://docs.apryse.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example
 WebViewer(...)
  .then(function(instance) {
    instance.UI.addToViewOnlyWhitelist(['toolbarGroup-View']);
    instance.UI.removeFromViewOnlyWhitelist(['toolbarGroup-View']);
  });
 */
export const removeFromViewOnlyWhitelist = (store) => (dataElements) => {
  checkTypes([dataElements], [TYPES.MULTI_TYPE(TYPES.STRING, TYPES.ARRAY(TYPES.STRING))], 'UI.removeFromViewOnlyWhitelist');
  dataElements = Array.isArray(dataElements) ? dataElements : [dataElements];
  const newWhiteList = store.getState().viewer.viewOnlyWhitelist.dataElement.filter((el) => !dataElements.includes(el));
  store.dispatch(actions.updateViewOnlyWhitelist(newWhiteList));
  const newBlackList = [...store.getState().viewer.viewOnlyWhitelist.dataElementBlacklist, ...dataElements];
  store.dispatch(actions.updateViewOnlyBlacklist(newBlackList));
};

/**
 * Gets the current view-only custom dataElement whitelist
 * @method UI.getViewOnlyWhitelist
 * @returns {Array.<string>} Array of data-elements that have been added to the custom whitelist in view-only mode.
 * @example
 * WebViewer(...)
 * .then(function(instance) {
 * const whitelist = instance.UI.getViewOnlyWhitelist();
 * console.log(whitelist);
 * });
 */
export const getViewOnlyWhitelist = (store) => () => {
  return [...store.getState().viewer.viewOnlyWhitelist.dataElement];
};

/**
 * Updates the view-only whitelist, which makes the elements in the whitelist visible and usable in view-only mode.
 * @method UI.updateViewOnlyWhitelist
 * @param {Array.<string>} dataElements Array of data-element attribute values for DOM elements to whitelist in view-only mode. To find data-element of a DOM element, refer to <a href='https://docs.apryse.com/documentation/web/guides/hiding-elements/#finding-dataelement-attribute-values' target='_blank'>Finding data-element attribute values</a>.
 * @example
 WebViewer(...)
  .then(function(instance) {
    instance.UI.updateViewOnlyWhitelist(['toolbarGroup-View']);
  });
 */
export const updateViewOnlyWhitelist = (store) => (dataElements) => {
  checkTypes([dataElements], [TYPES.ARRAY(TYPES.STRING)], 'UI.updateViewOnlyWhitelist');
  store.dispatch(actions.updateViewOnlyWhitelist(dataElements));
};

/**
 * Updates the shortcut whitelist for view-only mode.
 * @method UI.updateViewOnlyShortcuts
 * @param {Array.<string>} shortcuts Array of shortcut names to whitelist in view-only mode. Must be one of UI.Shortcuts
 * @example
 * WebViewer(...)
 * .then(function(instance) {
 *    instance.UI.updateViewOnlyShortcuts([instance.UI.Shortcuts.RECTANGLE]);
 *    });
 */
export const updateViewOnlyShortcuts = (store) => (shortcuts) => {
  checkTypes([shortcuts], [TYPES.ARRAY(TYPES.ONE_OF(Object.values(Shortcuts)))], 'UI.updateViewOnlyShortcuts');
  setViewOnlyShortcuts(shortcuts);
  const isViewOnly = selectors.isViewOnly(store.getState());
  if (isViewOnly) {
    // Toggle hotkeys view-only mode off and on to apply the new shortcuts
    hotkeysManager.setViewOnlyMode(false);
    hotkeysManager.setViewOnlyMode(true);
  }
};

/**
 * Gets the current shortcut whitelist for view-only mode.
 * @method UI.getViewOnlyShortcuts
 * @returns {Array.<string>} Array of shortcut names that have been added to the shortcut whitelist in view-only mode. Each name is one of UI.Shortcuts
 * @example
 * WebViewer(...)
 * .then(function(instance) {
 * const shortcuts = instance.UI.getViewOnlyShortcuts();
 * console.log(shortcuts);
 * });
 */
export const getViewOnlyShortcuts = () => {
  return [...getShortcuts()];
};