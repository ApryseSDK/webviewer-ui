/**
 * Exports the current state of the modular components, headers, and panels in the UI as JSON data. Removes any invalid items after validation. Also removes any prebuilt flyouts and overflow flyouts. Functions found in components such as onClick cannot be exported in JSON data. Use a Function Map to redefine them on import. See https://docs.apryse.com/api/web/UI.html#.importModularComponents__anchor for more information.
 * @method UI.exportModularComponents
 * @return {Object} JSON object containing maps of components, headers, panels, and flyouts to be used in the UI. ex: { modularComponents: { ... }, modularHeaders: { ... }, panels: { ... }, flyouts: { ... } }
 * @example
 * WebViewer(...)
 .then(function (instance) {
    instance.UI.exportModularComponents();
 */
import React from 'react';
import { PANEL_TYPE } from './addPanel';
import { ITEM_TYPE, PREBUILT_FLYOUTS, OVERFLOW_FLYOUTS, ITEM_RENDER_PREFIXES } from 'constants/customizationVariables';
import cloneDeep from 'lodash/cloneDeep';

export default (store) => () => {
  const state = store.getState();
  const { checkTypes } = window.Core;
  const disabledElements = Object.keys(state.viewer.disabledElements)
    .filter((element) => state.viewer.disabledElements[element].disabled)
    .map((element) => element);

  const shouldAddDisabledFlag = (componentObject) => {
    const dataElement = componentObject.dataElement;
    if (disabledElements.includes(dataElement)) {
      componentObject['disabled'] = true;
    }
  };

  const getFunctionKey = (functionReference, storedFunctions, componentName, functionSignature) => {
    for (const [functionKey, storedFunction] of Object.entries(storedFunctions)) {
      if (storedFunction === functionSignature) {
        return functionKey;
      }
    }
    console.warn(
      `Function in ${functionReference} of ${componentName} not found in Function Map and cannot be included in export JSON. Ensure that the following is included to your Function Map to define it on import:\n`,
      `\nfunctionMap: {\n  ...,\n  '${'{functionName}'}': ${functionSignature},\n}\n`,
      '\nSee https://docs.apryse.com/api/web/UI.html#.importModularComponents__anchor for more information.'
    );
    return '';
  };

  const handleReactElement = (item) => {
    const dataElement = item.props.dataElement;
    if (item.key && item.key.startsWith(`${ITEM_RENDER_PREFIXES.STYLE_PANEL}-`)) {
      return {
        dataElement: dataElement,
        render: ITEM_RENDER_PREFIXES.STYLE_PANEL,
      };
    }
    console.warn(`Unsupported render type detected for React element with key: ${item.key}. This item will be skipped in export.`);
    return null;
  };

  const isDividerItem = (item) => {
    return item === ITEM_TYPE.DIVIDER || (item.type && item.type === ITEM_TYPE.DIVIDER);
  };

  const processItemWithRender = (item, components) => {
    const exportItem = {};
    for (const prop in item) {
      if (prop === 'onClick') {
        const storedModularComponentFunctions = state.viewer.modularComponentFunctions;
        exportItem.onClick = getFunctionKey('onClick', storedModularComponentFunctions, item.dataElement, item[prop]);
      } else if (prop === 'children' && Array.isArray(item[prop])) {
        exportItem.children = processItems(item.children, item.dataElement, components);
      } else {
        exportItem[prop] = item[prop];
      }
    }
    return exportItem;
  };

  const validateItemType = (item, parentKey) => {
    const allowedTypes = [ITEM_TYPE.PRESET_BUTTON, ITEM_TYPE.BUTTON, ITEM_TYPE.STATEFUL_BUTTON, ITEM_TYPE.TOGGLE_BUTTON];
    if (!allowedTypes.includes(item.type)) {
      const allowedTypesString = allowedTypes.join(', ');
      console.warn(`Only ${allowedTypesString} items are supported in export JSON. Removing item: ${item.dataElement} found in component: ${parentKey}`);
      return false;
    }
    return true;
  };

  const ensureComponentExists = (item, components) => {
    if (!components[item.dataElement]) {
      const newComponent = validateComponents({ [item.dataElement]: item });
      components[item.dataElement] = newComponent[item.dataElement];
    }
  };

  const processItems = (items, parentKey, components = {}) => {
    return items.map((item) => {
      if (React.isValidElement(item)) {
        return handleReactElement(item);
      }

      if (isDividerItem(item)) {
        return ITEM_TYPE.DIVIDER;
      }

      // Process children recursively
      if (item.children && Array.isArray(item.children)) {
        item.children = processItems(item.children, item.dataElement, components);
      }

      if (item.render) {
        return processItemWithRender(item, components);
      }

      if (!validateItemType(item, parentKey)) {
        return null;
      }

      ensureComponentExists(item, components);

      return item.dataElement;
    }).filter((item) => item !== null);
  };

  const isInvalidKey = (key) => {
    return key === 'undefined' || key === 'null';
  };

  const shouldRemoveEmptyObject = (obj, key) => {
    return Object.keys(obj).length === 0 && key !== 'groupedItems';
  };

  const processComponentValue = (key, value, componentObject, component) => {
    // Skip React elements - they should be handled by processItems
    if (React.isValidElement(value)) {
      delete componentObject[key];
      return;
    }

    if (key === 'children' && Array.isArray(value)) {
      componentObject[key] = processItems(value, componentObject.dataElement || key, component);
      return;
    }

    // Recursively validate nested objects
    if (typeof value === 'object') {
      componentObject[key] = validateComponents(value);
      // Check if the object is empty after validation and remove it
      // Do not remove groupedItems as they are used in headers, even in an empty state
      if (shouldRemoveEmptyObject(componentObject[key], key)) {
        delete componentObject[key];
      }
      return;
    }

    if (typeof value === 'function') {
      const storedModularComponentFunctions = state.viewer.modularComponentFunctions;
      const componentIdentifier = componentObject.dataElement || JSON.stringify(componentObject);
      componentObject[key] = getFunctionKey(key, storedModularComponentFunctions, componentIdentifier, value);
    }
  };

  const removePresetButtonIcon = (componentObject) => {
    // We should not export icons for preset buttons
    if (componentObject?.type === ITEM_TYPE.PRESET_BUTTON) {
      delete componentObject.icon;
    }
  };

  const validateComponents = (component) => {
    const componentObject = cloneDeep(component);

    for (const key in componentObject) {
      if (isInvalidKey(key)) {
        console.warn(`Null or undefined item found. Removing item: ${key} found in components`);
        delete componentObject[key];
        continue;
      }

      const value = componentObject[key];
      processComponentValue(key, value, componentObject, component);
    }

    removePresetButtonIcon(componentObject);

    shouldAddDisabledFlag(componentObject);
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
      shouldAddDisabledFlag(header);
    }
    return modularHeaders;
  };

  const modularComponents = validateComponents(state.viewer.modularComponents);
  const modularHeaders = validateHeaders(state.viewer.modularHeaders);
  const panelList = state.viewer.genericPanels;
  const flyoutMap = state.viewer.flyoutMap;
  const popupsMap = state.viewer.modularPopups;

  const convertPanelsToMap = (panelsArray) => {
    const panelsMap = {};

    panelsArray.forEach((panel) => {
      const panelObject = cloneDeep(panel);
      checkTypes([panelObject], [PANEL_TYPE], 'UI.exportModularComponents');
      shouldAddDisabledFlag(panelObject);
      const PANEL_RENDER_FUNCTION_KEY = 'render';
      if (typeof panelObject[PANEL_RENDER_FUNCTION_KEY] === 'function') {
        const storedModularComponentFunctions = state.viewer.modularComponentFunctions;
        const dataElement = panelObject.dataElement;
        panelObject.render = getFunctionKey(PANEL_RENDER_FUNCTION_KEY, storedModularComponentFunctions, dataElement, panelObject.render);
      }
      panelsMap[panelObject.dataElement] = panelObject;
    });

    return panelsMap;
  };

  const prepareFlyouts = (flyouts, components) => {
    const normalizedFlyouts = {};
    for (const key in flyouts) {
      const flyout = flyouts[key];
      // Skip prebuilt flyouts and overflow flyouts
      if (flyout.className && [...PREBUILT_FLYOUTS, ...OVERFLOW_FLYOUTS].includes(flyout.className)) {
        continue;
      }
      const items = processItems(flyout.items, key, components);
      shouldAddDisabledFlag(flyout);
      normalizedFlyouts[key] = { ...flyout, items };
    }
    return normalizedFlyouts;
  };

  const preparePopups = (popups) => {
    const cloned = cloneDeep(popups || {});
    const fnMap = state.viewer.modularComponentFunctions || {};
    const FUNCTION_PROPS = ['onClick', 'render'];

    const toKeyOrDelete = (obj, prop) => {
      const val = obj[prop];
      if (typeof val !== 'function') {
        return;
      } // keep non-function values as-is (e.g., string render prefixes)
      const key = getFunctionKey(prop, fnMap, obj.dataElement, val);
      if (key) {
        obj[prop] = key;
      } else {
        delete obj[prop];
      }
    };

    const sanitizeItem = (item) => {
      // Allow strings/dividers/React elements or any non-object to pass through unchanged
      if (!item || typeof item !== 'object') {
        return item;
      }
      // Shallow clone so we never mutate the original
      const out = { ...item };
      FUNCTION_PROPS.forEach((p) => toKeyOrDelete(out, p));
      return out;
    };

    const sanitizePopupItems = (items = []) => items.map(sanitizeItem);

    const result = {};
    for (const [popupKey, popupItems] of Object.entries(cloned)) {
      result[popupKey] = sanitizePopupItems(popupItems);
    }
    return result;
  };

  const panels = convertPanelsToMap(panelList);
  const flyouts = prepareFlyouts(flyoutMap, modularComponents);
  const popups = preparePopups(popupsMap);


  const allData = {
    modularComponents,
    modularHeaders,
    panels,
    flyouts,
    popups,
  };

  return allData;
};