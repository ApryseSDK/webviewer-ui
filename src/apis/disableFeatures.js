/**
 * Disable certain features in the WebViewer UI.
 * @method WebViewer#disableFeatures
 * @param {string[]} features Array of features to disable. Valid values are 'download' and 'copyText'
 * @example
WebViewer(...)
  .then(function(instance) {
    // disable the copyText feature
    // this will disallow users to copy text through CTRL/CMD + C and disable the copy button
    instance.disableFeatures(['copyText']);
  });
 */

import createFeatureAPI from 'helpers/createFeatureAPI';

const enable = false;
export default store => createFeatureAPI(enable, store);
