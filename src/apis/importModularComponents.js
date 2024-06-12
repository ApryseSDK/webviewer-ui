/**
 * Creates a new modular UI using the provided JSON data and function map. The data is validated and will throw an error if a part of its structure is not valid. Existing UI components will be replaced with the new components provided in the JSON data.
 * @method UI.importModularComponents
 * @param {Object} data The JSON data containing maps of components, headers, and panels to be used in the UI. If any of the properties are not provided, they will not be used in the UI. ex: { modularComponents: { ... }, modularHeaders: { ... }, panels: { ... } }
 * @property {Object} modularComponents The map of components to be used in the UI. Refer to: {@link ItemProperties} for properties of modularComponents
 * @property {Object} modularHeaders The map of headers to be used in the UI. Refer to: {@link ContainerProperties} for properties of modularHeaders
 * @property {Object} panels The map of panels to be used in the UI. Refer to: {@link PanelProperties} for properties of panels
 * @property {Object} flyouts The map of flyouts to be used in the UI.
 * @property {string} flyouts.dataElement A unique string that identifies the flyout.
 * @property {Array<string>} flyouts.items An array of strings that represent the items in the flyout. Each string should be the dataElement of a component in the modularComponents map.
 * @param {object} functionMap A map of functions to be used in the components. The keys should match the function names used in the components. The values should be the actual functions to be called.
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
import { ITEM_TYPE, PREBUILT_FLYOUTS } from 'constants/customizationVariables';
import { panelNames } from 'constants/panel';
import cloneDeep from 'lodash/cloneDeep';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';

const { checkTypes, TYPES } = window.Core;

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
      const COMPONENT_FUNCTION_KEYS = ['onClick', 'mount', 'unmount'];
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

const validatePanels = (panels) => {
  const normalizedPanel = TYPES.OBJECT({
    dataElement: TYPES.STRING,
    location: TYPES.ONE_OF('left', 'right'),
    render: TYPES.MULTI_TYPE(TYPES.ONE_OF(...Object.values(panelNames)), TYPES.FUNCTION)
  });
  const panelKeys = Object.keys(panels);
  panelKeys.forEach((key) => {
    try {
      checkTypes([panels[key]], [normalizedPanel], 'UI.importModularComponents.validatePanels');
    } catch (error) {
      throw new Error(`Import has been aborted.\nInvalid panel found: ${key} - ${error.message}`);
    }
  });
};

const flyoutItemType = TYPES.OBJECT({
  dataElement: TYPES.STRING,
  type: TYPES.ONE_OF([ITEM_TYPE.PRESET_BUTTON, ITEM_TYPE.BUTTON, ITEM_TYPE.STATEFUL_BUTTON, ITEM_TYPE.TOGGLE_BUTTON]),
  children: TYPES.OPTIONAL(TYPES.ARRAY(TYPES.STRING)) // Recursive type reference
});


const validateFlyoutItems = (items, components, key) => {
  items.forEach((item) => {
    if (item === ITEM_TYPE.DIVIDER) {
      return; // Skip validation for dividers
    }
    if (!components[item]) {
      throw new Error(`Invalid item found in flyout: ${key} - ${item} not found in components`);
    }
    checkTypes([components[item]], [flyoutItemType], `UI.importModularComponents.validateFlyouts - ${JSON.stringify(components[item])}`);

    // Recursively validate children if they exist
    if (components[item].children && Array.isArray(components[item].children)) {
      validateFlyoutItems(components[item].children, components, key);
    }
  });
};


const validateFlyouts = (flyouts, components) => {
  const normalizedFlyout = TYPES.OBJECT({
    dataElement: TYPES.STRING,
    items: TYPES.ARRAY(TYPES.STRING)
  });
  const flyoutKeys = Object.keys(flyouts);
  flyoutKeys.forEach((key) => {
    try {
      checkTypes([flyouts[key]], [normalizedFlyout], 'UI.importModularComponents.validateFlyouts');
      if (flyouts[key].items?.length > 0) {
        validateFlyoutItems(flyouts[key].items, components, key);
      }
    } catch (error) {
      throw new Error(`Invalid flyout found: ${key} - ${error.message}`);
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
    validatePanels(jsonData.panels);
  }

  if (jsonData.flyouts) {
    validateFlyouts(jsonData.flyouts, jsonData.modularComponents);
  }
};

export default (store) => async (components, functions = {}) => {
  store.dispatch(actions.resetModularUIState());
  const componentsToValidate = cloneDeep(components);
  validateJSONStructure(componentsToValidate, functions);
  const headersMap = componentsToValidate.modularHeaders || {};
  const componentMap = componentsToValidate.modularComponents || {};
  const panels = componentsToValidate.panels || {};
  const flyouts = componentsToValidate.flyouts || {};

  const panelList = Object.values(panels).map((panel) => panel);

  store.dispatch(actions.setModularComponentFunctions(functions));

  const getFunctionFromFunctionMap = (functionString) => {
    const storedModularComponentFunctions = store.getState().viewer.modularComponentFunctions;
    return storedModularComponentFunctions[functionString] || (() => { });
  };

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
  });

  store.dispatch(actions.setModularHeadersAndComponents(componentMap, headersMap));
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
      if (typeof item === 'string') {
        item = componentMap[item];
      }
      if (item.children) {
        item.children = mapItems(item.children);
      }
      return item;
    });
  };

  // Add normalized flyouts
  Object.values(flyouts).forEach((flyout) => {
    flyout.items = mapItems(flyout.items);
    store.dispatch(actions.addFlyout(flyout));
  });

  // add prebuilt flyouts
  Object.values(prebuiltFlyouts).forEach((flyout) => {
    store.dispatch(actions.addFlyout(flyout));
  });

  fireEvent(Events['MODULAR_UI_IMPORTED'], { importedComponents: components });
};