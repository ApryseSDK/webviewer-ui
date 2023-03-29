/**
 * Set the WV3D Properties Panel with an array of model data objects
 * @method UI.setWv3dPropertiesPanelModelData
 * @param {array} modelData Array of objects defining 3d metadata properties.
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
