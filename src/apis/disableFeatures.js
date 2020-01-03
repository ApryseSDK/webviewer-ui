/**
 * Disable certain features in the WebViewer UI.
 * @method WebViewerInstance#disableFeatures
 * @param {Array.<string>} features Array of features to disable.
 * @see WebViewerInstance#Feature
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.disableFeatures(instance.Feature.Measurement);
  });
 */

import createFeatureAPI from 'helpers/createFeatureAPI';

const enable = false;
export default store => createFeatureAPI(enable, store);
