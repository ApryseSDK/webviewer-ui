/**
 * @typedef {object} UI.ModularComponentsData
 * @property {Object.<string, UI.Components.ItemProperties>} [modularComponents] The map of components to be used in the UI, where keys are component identifiers
 * @property {Object.<string, UI.Components.ContainerProperties>} [modularHeaders] The map of headers to be used in the UI, where keys are header identifiers
 * @property {Object.<string, UI.PanelProperties>} [panels] The map of panels to be used in the UI, where keys are panel identifiers
 * @property {Object.<string, UI.Components.Flyout>} [flyouts] The map of flyouts to be used in the UI, where keys are flyout identifiers
 * @property {Object.<string, Array.<object>>} [popups] The map of popups to be used in the UI, where keys are popup identifiers and values are arrays of popup items (objects with at minimum a dataElement property)
 */

/**
 * Creates a new modular UI using the provided JSON data and function map. The data is validated and will throw an error if a part of its structure is not valid. Existing UI components will be replaced with the new components provided in the JSON data.
 * @method UI.importModularComponents
 * @param {UI.ModularComponentsData} data The JSON data containing maps of components, headers, and panels to be used in the UI. If any of the properties are not provided, they will not be used in the UI
 * @param {object} [functionMap] A map of functions to be used in the components. The keys should match the function names used in the components. The values should be the actual functions to be called
 * @example
 * WebViewer(...)
 .then(function (instance) {
    const response = await fetch('./modular-components.json');
    const data = await response.json();

      const functionMap = {
      'alertClick': () => alert("Alert triggered!"),
      'singlePageOnClick': (update) => {
        update('DoublePage');
      },
      'doublePageOnClick': (update) => {
        update('SinglePage');
      },
      'statefulButtonMount': () => {},
      'statefulButtonUnmount': () => {},
      };

    instance.UI.importModularComponents(data, functionMap);
 */
import actions from 'actions';
import setPanels from './setPanels';
import { ITEM_TYPE, PREBUILT_FLYOUTS, ITEM_RENDER_PREFIXES, PANEL_LOCATION } from 'constants/customizationVariables';
import { PRIORITY_THREE } from 'constants/actionPriority';
import { panelNames } from 'constants/panel';
import cloneDeep from 'lodash/cloneDeep';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';
import { defaultPopups } from 'src/redux/modularComponents';

const { checkTypes, TYPES } = window.Core;
const disabledElements = [];
const enabledElements = new Set();

const isElementDisabled = (element) => {
  if (element.disabled) {
    disabledElements.push(element.dataElement);
  } else {
    enabledElements.add(element.dataElement);
  }
};

const validateComponents = (components, functionMap) => {
  const normalizedComponent = TYPES.OBJECT({
    dataElement: TYPES.STRING,
    type: TYPES.ONE_OF(Object.values(ITEM_TYPE)),
  });
  const componentKeys = Object.keys(components);
  componentKeys.forEach((key) => {
    try {
      if (components[key]._dataElement && !components[key].dataElement) {
        components[key].dataElement = components[key]._dataElement;
      }
      checkTypes([components[key]], [normalizedComponent], 'UI.importModularComponents.validateComponents');
      isElementDisabled(components[key]);
      const COMPONENT_FUNCTION_KEYS = ['onClick', 'mount', 'unmount', 'render'];
      Object.keys(components[key]).forEach((prop) => {
        if (COMPONENT_FUNCTION_KEYS.includes(prop) && (!components[key][prop] || !functionMap[components[key][prop]])) {
          console.warn(`Function: ${components[key][prop] || prop} not defined on component: ${key}. Use Function Map to define it. See https://docs.apryse.com/api/web/UI.html#.importModularComponents__anchor for more information.`);
        }
      });
      if (components[key].items) {
        components[key].items.forEach((item) => {
          if (!components[item]) {
            throw new Error(`Invalid item found in component: ${key} - ${item} not found in components`);
          }
        });
      }
    } catch (error) {
      throw new Error(`Import has been aborted.\nInvalid component found: ${key} - ${error.message}`);
    }
  });
};

const validateHeaders = (headers, components) => {
  const normalizedHeader = TYPES.OBJECT({
    dataElement: TYPES.STRING,
    placement: TYPES.ONE_OF('top', 'bottom', 'left', 'right'),
  });
  const headerKeys = Object.keys(headers);
  headerKeys.forEach((key) => {
    try {
      checkTypes([headers[key]], [normalizedHeader], 'UI.importModularComponents.validateHeaders');
      isElementDisabled(headers[key]);
      if (headers[key].items?.length > 0) {
        headers[key].items.forEach((item) => {
          if (!components[item]) {
            throw new Error(`Invalid item found in header: ${key} - ${item} not found in components`);
          }
        });
      }
    } catch (error) {
      throw new Error(`Import has been aborted.\nInvalid header found: ${key} - ${error.message}`);
    }
  });
};

const validatePanels = (panels, functionMap = {}) => {
  const normalizedPanel = TYPES.OBJECT({
    dataElement: TYPES.STRING,
    location: TYPES.ONE_OF(Object.values(PANEL_LOCATION)),
    render: TYPES.MULTI_TYPE(TYPES.ONE_OF(...Object.values(panelNames)), TYPES.FUNCTION)
  });
  const panelKeys = Object.keys(panels);
  panelKeys.forEach((key) => {
    try {
      if (Object.keys(functionMap).includes(panels[key].render)) {
        panels[key].render = functionMap[panels[key].render];
      }
      checkTypes([panels[key]], [normalizedPanel], 'UI.importModularComponents.validatePanels');
      isElementDisabled(panels[key]);
    } catch (error) {
      throw new Error(`Import has been aborted.\nInvalid panel found: ${key} - ${error.message}`);
    }
  });
};

const flyoutItemType = TYPES.OBJECT({
  dataElement: TYPES.STRING,
  type: TYPES.OPTIONAL(TYPES.ONE_OF([ITEM_TYPE.PRESET_BUTTON, ITEM_TYPE.BUTTON, ITEM_TYPE.STATEFUL_BUTTON, ITEM_TYPE.TOGGLE_BUTTON])),
  render: TYPES.OPTIONAL(TYPES.MULTI_TYPE(TYPES.STRING, TYPES.FUNCTION)),
  children: TYPES.OPTIONAL(TYPES.ARRAY(TYPES.MULTI_TYPE(TYPES.STRING, TYPES.OBJECT({})))) // Allow both strings and objects
});


const validateFlyoutItems = (items, components, key) => {
  items.forEach((item) => {
    if (item === ITEM_TYPE.DIVIDER) {
      return; // Skip validation for dividers
    }

    let itemToValidate = item;

    if (typeof item === 'object' && item.dataElement) {
      checkTypes([item], [flyoutItemType], `UI.importModularComponents.validateFlyouts - ${JSON.stringify(item)}`);
      isElementDisabled(item);
      itemToValidate = item;
    } else if (typeof item === 'string') {
      if (!components[item]) {
        throw new Error(`Invalid item found in flyout: ${key} - ${item} not found in components`);
      }
      checkTypes([components[item]], [flyoutItemType], `UI.importModularComponents.validateFlyouts - ${JSON.stringify(components[item])}`);
      isElementDisabled(components[item]);
      itemToValidate = components[item];
    }
    // Recursively validate children once for the resolved item
    if (itemToValidate.children && Array.isArray(itemToValidate.children)) {
      validateFlyoutItems(itemToValidate.children, components, key);
    }
  });
};


const validateFlyouts = (flyouts, components) => {
  const normalizedFlyout = TYPES.OBJECT({
    dataElement: TYPES.STRING,
    items: TYPES.ARRAY(TYPES.MULTI_TYPE(TYPES.STRING, TYPES.OBJECT({}))),
    toggleElement: TYPES.OPTIONAL(TYPES.STRING),
  });
  const flyoutKeys = Object.keys(flyouts);
  flyoutKeys.forEach((key) => {
    try {
      checkTypes([flyouts[key]], [normalizedFlyout], 'UI.importModularComponents.validateFlyouts');
      isElementDisabled(flyouts[key]);

      if (flyouts[key].items?.length > 0) {
        validateFlyoutItems(flyouts[key].items, components, key);
      }
    } catch (error) {
      throw new Error(`Invalid flyout found: ${key} - ${error.message}`);
    }
  });
};

const validatePopups = (popups) => {
  const normalizedPopup = TYPES.ARRAY(TYPES.OBJECT({
    dataElement: TYPES.STRING
  }));

  const popupKeys = Object.keys(popups);
  popupKeys.forEach((key) => {
    try {
      checkTypes([popups[key]], [normalizedPopup], 'UI.importModularComponents.validatePopups');
    } catch (error) {
      throw new Error(`Invalid popup found: ${key} - ${error.message}`);
    }
  });

};

const validateJSONStructure = (jsonData, functionMap) => {
  if (!jsonData) {
    throw new Error('No data provided');
  }

  if (jsonData.modularComponents) {
    validateComponents(jsonData.modularComponents, functionMap);
  }

  if (jsonData.modularHeaders) {
    validateHeaders(jsonData.modularHeaders, jsonData.modularComponents);
  }

  if (jsonData.panels) {
    validatePanels(jsonData.panels, functionMap);
  }

  if (jsonData.flyouts) {
    validateFlyouts(jsonData.flyouts, jsonData.modularComponents);
  }

  if (jsonData.popups) {
    validatePopups(jsonData.popups);
  }
};

const handleDisabledAndEnabledElements = (store) => {
  const disabledElementsRedux = store.getState().viewer.disabledElements;
  const elementsToEnable = [];

  Object.keys(disabledElementsRedux).forEach((key) => {
    if (disabledElementsRedux[key].disabled && enabledElements.has(key)) {
      elementsToEnable.push(key);
    }
  });

  store.dispatch(actions.enableElements(elementsToEnable, PRIORITY_THREE));
  store.dispatch(actions.disableElements(disabledElements));
  disabledElements.length = 0;
  enabledElements.length = 0;
};

export default (store) => async (components, functions = {}) => {
  store.dispatch(actions.resetModularUIState());
  const componentsToValidate = cloneDeep(components);
  checkTypes([componentsToValidate, functions], [TYPES.OBJECT({}), TYPES.OBJECT({})], 'UI.importModularComponents');
  validateJSONStructure(componentsToValidate, functions);
  const headersMap = componentsToValidate.modularHeaders || {};
  const componentMap = componentsToValidate.modularComponents || {};
  const panels = componentsToValidate.panels || {};
  const flyouts = componentsToValidate.flyouts || {};
  const popups = componentsToValidate.popups || { ...defaultPopups };

  const panelList = Object.values(panels).map((panel) => panel);

  store.dispatch(actions.setModularComponentFunctions(functions));
  handleDisabledAndEnabledElements(store);

  const getFunctionFromFunctionMap = (functionString) => {
    const storedModularComponentFunctions = store.getState().viewer.modularComponentFunctions;
    return storedModularComponentFunctions[functionString] || (() => { });
  };


  // Import popups and bind functions
  const fnMap = store.getState().viewer.modularComponentFunctions || {};
  const getFn = (key) => fnMap[key];
  const bindFunctionProps = (item, popupKey) => {
    if (!item || typeof item !== 'object') {
      return item;
    }
    const out = { ...item };

    for (const prop of ['onClick', 'render']) {
      const val = out[prop];
      if (typeof val === 'string') {
        const fn = getFn(val);
        if (typeof fn !== 'function') {
          console.warn(
            `importModularComponents: Missing function '${val}' for prop '${prop}' on popup item '${out.dataElement}' in popup '${popupKey}'. Provide it in the functionMap.`
          );
          // set a no-op function to avoid errors
          out[prop] = () => { };
        } else {
          out[prop] = fn;
        }
      }
    }

    return out;
  };

  for (const [popupKey, items] of Object.entries(popups)) {
    const mapped = (items || []).map((item) => bindFunctionProps(item, popupKey));
    store.dispatch(actions.setPopupItems(popupKey, mapped));
  }

  Object.values(componentMap).forEach((component) => {
    if (component.type === ITEM_TYPE.BUTTON) {
      component.onClick = getFunctionFromFunctionMap(component.onClick);
    }
    if (component.type === ITEM_TYPE.STATEFUL_BUTTON) {
      for (const key in component.states) {
        const state = component.states[key];
        if (state.onClick) {
          state.onClick = getFunctionFromFunctionMap(state.onClick);
        }
      }
      component.mount = getFunctionFromFunctionMap(component.mount);
      component.unmount = getFunctionFromFunctionMap(component.unmount);
    }
    if (component.type === ITEM_TYPE.CUSTOM_ELEMENT) {
      component.render = getFunctionFromFunctionMap(component.render);
    }
  });

  store.dispatch(actions.setModularHeadersAndComponents(headersMap, componentMap));
  setPanels(store)(panelList);

  // keep prebuilt flyouts
  const allFlyouts = store.getState().viewer.flyoutMap;
  const prebuiltFlyouts = {};
  Object.keys(allFlyouts).forEach((key) => {
    const flyoutClassName = allFlyouts[key].className;
    if (flyoutClassName && PREBUILT_FLYOUTS.includes(flyoutClassName)) {
      prebuiltFlyouts[key] = allFlyouts[key];
    }
  });

  // clear out existing flyouts
  store.dispatch(actions.setFlyouts({}));

  const mapItems = (items) => {
    return items.map((item) => {
      if (item === ITEM_TYPE.DIVIDER) {
        return ITEM_TYPE.DIVIDER;
      }
      // Handle object items (like those with render property)
      if (typeof item === 'object' && item.dataElement) {
        const processedItem = { ...item };
        if (item.render) {
          const isRenderTypeUnavailable = !Object.values(ITEM_RENDER_PREFIXES).includes(item.render);
          if (isRenderTypeUnavailable) {
            console.warn(`Unknown render type: ${item.render} for item ${item.dataElement}`);
          }
        }
        if (item.onClick) {
          processedItem.onClick = getFunctionFromFunctionMap(item.onClick);
        }
        if (item.children) {
          processedItem.children = mapItems(item.children);
        }
        return processedItem;
      }
      // Handle string items (references to components)
      if (typeof item === 'string') {
        item = componentMap[item];
      }
      if (item.children) {
        return { ...item, children: mapItems(item.children) };
      }
      return item;
    });
  };

  // Add normalized flyouts
  Object.values(flyouts).forEach((flyout) => {
    const flyoutWithMappedItems = { ...flyout, items: mapItems(flyout.items) };
    store.dispatch(actions.addFlyout(flyoutWithMappedItems));
  });

  // add prebuilt flyouts
  Object.values(prebuiltFlyouts).forEach((flyout) => {
    store.dispatch(actions.addFlyout(flyout));
  });

  fireEvent(Events['MODULAR_UI_IMPORTED'], { importedComponents: components });
};