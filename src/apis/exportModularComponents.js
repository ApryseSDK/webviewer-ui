/**
 * Exports the current state of the modular components, headers, and panels in the UI as JSON data. Removes any functions found in the components or invalid items after validation.
 * @method UI.exportModularComponents
 * @return {Object} JSON object containing maps of components, headers, and panels to used in the UI. ex: { modularComponents: { ... }, modularHeaders: { ... }, panels: { ... } }
 * @example
 * WebViewer(...)
 .then(function (instance) {
    instance.UI.exportModularComponents();
 */
import { PANEL_TYPE } from './addPanel';

export default (store) => () => {
  const state = store.getState();
  const { checkTypes } = window.Core;

  const validateComponents = (component) => {
    for (const key in component) {
      const value = component[key];
      if (typeof value === 'object') {
        // Recursively validate nested objects
        component[key] = validateComponents(value);
        // Check if the object is empty after validation and remove it
        if (Object.keys(component[key]).length === 0) {
          delete component[key];
        }
      } else if (typeof value === 'function') {
        console.warn(`Function values not supported in export JSON. Removing item: ${key} found in component: ${JSON.stringify(component)}`);
        delete component[key];
      }
    }
    return component;
  };

  const validateHeaders = (modularHeaders) => {
    for (const key in modularHeaders) {
      const header = modularHeaders[key];
      if (header.items && Array.isArray(header.items)) {
        header.items = header.items.filter((item) => {
          if (item === null || item === undefined) {
            console.warn(`Null or undefined item found. Removing item: ${item} found in header: '${key}'`);
            return false;
          }
          return true;
        });
      }
    }
    return modularHeaders;
  };

  const modularComponents = validateComponents(state.viewer.modularComponents);
  const modularHeaders = validateHeaders(state.viewer.modularHeaders);
  const panelList = state.viewer.genericPanels;

  const convertPanelsToMap = (panelsArray) => {
    const panelsMap = {};

    panelsArray.forEach((panel) => {
      checkTypes([panel], [PANEL_TYPE], 'UI.exportModularComponents');
      panelsMap[panel.dataElement] = panel;
    });

    return panelsMap;
  };

  const panels = convertPanelsToMap(panelList);

  const allData = {
    modularComponents,
    modularHeaders,
    panels,
  };

  return allData;
};