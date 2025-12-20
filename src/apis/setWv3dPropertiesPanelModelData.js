/**
 * @typedef {Object.<string, string>} UI.Wv3dModelDataObject
 * An object containing key-value pairs of 3D model metadata properties. Keys and values are both strings representing property names and their corresponding values (e.g., {'name':'roof', 'height':'55cm'})
 */

/**
 * Set the WV3D Properties Panel with an array of model data objects
 * @method UI.setWv3dPropertiesPanelModelData
 * @param {Array.<UI.Wv3dModelDataObject>} modelData Array of objects defining 3D metadata properties. Each object contains key-value pairs where both keys and values are strings
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setWv3dPropertiesPanelModelData([{'name':'roof', 'height':'55cm'}, {'name':'wall', 'height':'100cm'}]);
  });
 */

import actions from 'actions';

export default (store) => (modelData) => {
  store.dispatch(actions.setWv3dPropertiesPanelModelData(modelData));
};
