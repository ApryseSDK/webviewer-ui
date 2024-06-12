/**
 * Exports the current state of the modular components, headers, and panels in the UI as JSON data. Removes any invalid items after validation. Also removes any prebuilt flyouts and overflow flyouts. Functions found in components such as onClick cannot be exported in JSON data. Use a Function Map to redefine them on import. See https://docs.apryse.com/api/web/UI.html#.importModularComponents__anchor for more information.
 * @method UI.exportModularComponents
 * @return {Object} JSON object containing maps of components, headers, panels, and flyouts to be used in the UI. ex: { modularComponents: { ... }, modularHeaders: { ... }, panels: { ... }, flyouts: { ... } }
 * @example
 * WebViewer(...)
 .then(function (instance) {
    instance.UI.exportModularComponents();
 */
import { PANEL_TYPE } from './addPanel';
import { ITEM_TYPE, PREBUILT_FLYOUTS, OVERFLOW_FLYOUTS } from 'constants/customizationVariables';

export default (store) => () => {
  const state = store.getState();
  const { checkTypes } = window.Core;

  const validateComponents = (componentObject) => {
    for (const key in componentObject) {
      if (key === 'undefined' || key === 'null') {
        console.warn(`Null or undefined item found. Removing item: ${key} found in components`);
        delete componentObject[key];
        continue;
      }
      const value = componentObject[key];
      if (typeof value === 'object') {
        // Recursively validate nested objects
        componentObject[key] = validateComponents(value);
        // Check if the object is empty after validation and remove it
        // Do not remove groupedItems as they are used in headers, even in an empty state
        if (Object.keys(componentObject[key]).length === 0 && key !== 'groupedItems') {
          delete componentObject[key];
        }
      } else if (typeof value === 'function') {
        const storedModularComponentFunctions = state.viewer.modularComponentFunctions;
        const component = componentObject.dataElement || JSON.stringify(componentObject);
        if (Object.values(storedModularComponentFunctions).includes(value)) {
          componentObject[key] = Object.keys(storedModularComponentFunctions).find((funcKey) => storedModularComponentFunctions[funcKey] === value);
        } else {
          console.warn(`Function in ${key} of ${component} not found in Function Map and cannot be included in export JSON. Ensure that the following is included to your Function Map to define it on import:\n`, `\nfunctionMap: {\n  ...,\n  '${'{functionName}'}': ${value},\n}\n`, '\nSee https://docs.apryse.com/api/web/UI.html#.importModularComponents__anchor for more information.');
          componentObject[key] = '';
        }
      }
    }
    return componentObject;
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
  const flyoutMap = state.viewer.flyoutMap;

  const convertPanelsToMap = (panelsArray) => {
    const panelsMap = {};

    panelsArray.forEach((panel) => {
      checkTypes([panel], [PANEL_TYPE], 'UI.exportModularComponents');
      panelsMap[panel.dataElement] = panel;
    });

    return panelsMap;
  };

  const prepareFlyouts = (flyouts) => {
    const normalizedFlyouts = {};
    for (const key in flyouts) {
      const flyout = flyouts[key];
      // Skip prebuilt flyouts and overflow flyouts
      if (flyout.className && [...PREBUILT_FLYOUTS, ...OVERFLOW_FLYOUTS].includes(flyout.className)) {
        continue;
      }
      const items = processItems(flyout.items, key);
      normalizedFlyouts[key] = { ...flyout, items };
    }
    return normalizedFlyouts;
  };

  const processItems = (items, parentKey) => {
    return items.map((item) => {
      if (item.children && Array.isArray(item.children)) {
        item.children = processItems(item.children, item.dataElement); // Recursively process children
      }
      if (item === ITEM_TYPE.DIVIDER || (item.type && item.type === ITEM_TYPE.DIVIDER)) {
        return ITEM_TYPE.DIVIDER;
      }
      if (!item.dataElement && item) {
        console.warn(`Invalid item found in flyout: ${parentKey} - ${JSON.stringify(item)} missing dataElement`);
        return null;
      }
      const allowedTypes = [ITEM_TYPE.PRESET_BUTTON, ITEM_TYPE.BUTTON, ITEM_TYPE.STATEFUL_BUTTON, ITEM_TYPE.TOGGLE_BUTTON];
      if (!allowedTypes.includes(item.type)) {
        const allowedTypesString = allowedTypes.join(', ');
        console.warn(`Only ${allowedTypesString} items are supported in export JSON. Removing item: ${item.dataElement} found in component: ${parentKey}`);
        return null;
      }
      if (!modularComponents[item.dataElement]) {
        const newComponent = validateComponents({ [item.dataElement]: item });
        modularComponents[item.dataElement] = newComponent[item.dataElement];
      }

      return item.dataElement;
    }).filter((item) => item !== null);
  };

  const panels = convertPanelsToMap(panelList);
  const flyouts = prepareFlyouts(flyoutMap);

  const allData = {
    modularComponents,
    modularHeaders,
    panels,
    flyouts,
  };

  return allData;
};