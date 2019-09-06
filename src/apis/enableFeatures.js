/**
 * Enable certain features in the WebViewer UI.
 * @method WebViewer#enableFeatures
 * @param {string[]} features Array of features to enable. Valid values are 'download' and 'copyText'
 * @example
WebViewer(...)
  .then(function(instance) {
    // enable the copyText feature
    // this will allow users to copy text through CTRL/CMD + C and enable the copy button
    instance.enableFeatures(['copyText']);
  });
 */

import createFeatureAPI from 'helpers/createFeatureAPI';

const enable = true;
export default store => createFeatureAPI(enable, store);
