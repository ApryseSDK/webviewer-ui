/**
 * disable certain features in the WebViewer UI.
 * @method WebViewer#disableFeatures
 * @param {Array.<WebViewer#Feature>} features Array of features to disable.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.disableFeatures(instance.Feature.Measurement);
  });
 */

import createFeatureAPI from 'helpers/createFeatureAPI';

const enable = false;
export default store => createFeatureAPI(enable, store);
