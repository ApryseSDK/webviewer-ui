/**
 * Enable certain features in the WebViewer UI.
 * @method UI.enableFeatures
 * @param {Array.<string>} features Array of features to enable.
 * @see UI.Feature
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableFeatures(instance.Feature.Measurement);
  });
 */

import createFeatureAPI from 'helpers/createFeatureAPI';

const enable = true;
export default store => createFeatureAPI(enable, store);