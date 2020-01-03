/**
 * Enable certain features in the WebViewer UI.
 * @method WebViewerInstance#enableFeatures
 * @param {Array.<string>} features Array of features to enable.
 * @see WebViewerInstance#Feature
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.enableFeatures(instance.Feature.Measurement);
  });
 */

import createFeatureAPI from 'helpers/createFeatureAPI';

const enable = true;
export default store => createFeatureAPI(enable, store);