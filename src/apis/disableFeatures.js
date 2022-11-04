/**
 * Disable certain features in the WebViewer UI.
 * @method UI.disableFeatures
 * @param {Array.<string>} features Array of features to disable.
 * @see UI.Feature
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.disableFeatures(instance.Feature.Measurement);
  });
 */

import createFeatureAPI from 'helpers/createFeatureAPI';

const enable = false;
export default (store) => createFeatureAPI(enable, store);
