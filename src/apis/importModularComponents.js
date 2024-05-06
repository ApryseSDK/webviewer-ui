/**
 * Creates a new modular UI using the provided JSON data. The data is validated and will throw an error if a part of its structure is not valid. Existing UI components will be replaced with the new components provided in the JSON data.
 * @method UI.importModularComponents
 * @param {Object} data The JSON data containing maps of components, headers, and panels to be used in the UI. If any of the properties are not provided, they will not be used in the UI. ex: { modularComponents: { ... }, modularHeaders: { ... }, panels: { ... } }
 * @property {Object} modularComponents The map of components to be used in the UI. Refer to: {@link ItemProperties} for properties of modularComponents
 * @property {Object} modularHeaders The map of headers to be used in the UI. Refer to: {@link ContainerProperties} for properties of modularHeaders
 * @property {Object} panels The map of panels to be used in the UI. Refer to: {@link PanelProperties} for properties of panels
 * @example
 * WebViewer(...)
 .then(function (instance) {
    const response = await fetch('./modular-components.json');
    const data = await response.json();

    instance.UI.importModularComponents(data);
 */
import actions from 'actions';
import setPanels from './setPanels';
import { ITEM_TYPE } from 'constants/customizationVariables';
import { panelNames } from 'constants/panel';

const { checkTypes, TYPES } = window.Core;

const validateComponents = (components) => {
  const normalizedComponent = TYPES.OBJECT({
    dataElement: TYPES.STRING,
    type: TYPES.ONE_OF(Object.values(ITEM_TYPE)),
  });
  const componentKeys = Object.keys(components);
  componentKeys.forEach((key) => {
    try {
      checkTypes([components[key]], [normalizedComponent], 'UI.importModularComponents.validateComponents');
      if (components[key].items) {
        components[key].items.forEach((item) => {
          if (!components[item]) {
            throw new Error(`Invalid item found in component: ${key} - ${item} not found in components`);
          }
        });
      }
    } catch (error) {
      throw new Error(`Invalid component found: ${key} - ${error.message}`);
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
      if (headers[key].items) {
        headers[key].items.forEach((item) => {
          if (!components[item]) {
            throw new Error(`Invalid item found in header: ${key} - ${item} not found in components`);
          }
        });
      }
    } catch (error) {
      throw new Error(`Invalid header found: ${key} - ${error.message}`);
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
      throw new Error(`Invalid panel found: ${key} - ${error.message}`);
    }
  });
};


const validateJSONStructure = (jsonData) => {
  if (!jsonData) {
    throw new Error('No data provided');
  }

  if (jsonData.modularComponents) {
    validateComponents(jsonData.modularComponents);
  }

  if (jsonData.modularHeaders) {
    validateHeaders(jsonData.modularHeaders, jsonData.modularComponents);
  }

  if (jsonData.panels) {
    validatePanels(jsonData.panels);
  }
};

export default (store) => async (data) => {
  validateJSONStructure(data);

  const headersMap = data.modularHeaders || {};
  const componentMap = data.modularComponents || {};
  const panels = data.panels || {};

  const panelList = Object.values(panels).map((panel) => panel);

  store.dispatch(actions.setModularHeadersAndComponents(componentMap, headersMap));
  setPanels(store)(panelList);
};