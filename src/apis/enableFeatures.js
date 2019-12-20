/**
 * Enable certain features in the WebViewer UI.
 * @method WebViewerInstance#enableFeatures
 * @param {Array.<WebViewerInstance.Feature>} features Array of features to enable.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.enableFeatures(instance.Feature.Measurement);
  });
 */

import createFeatureAPI from 'helpers/createFeatureAPI';

const enable = true;
export default store => createFeatureAPI(enable, store);
