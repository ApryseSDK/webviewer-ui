/**
 * Add a handler to the given keyboard shortcut
 * @method WebViewer#
 * @param {Array.<WebViewer#Feature>} features Array of features to enable.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.enableFeatures(instance.Feature.Measurement);
  });
 */

import hotkeysManager from 'helpers/hotkeysManager';

export default {
  on: (...args) => {
    hotkeysManager.on(...args);
  },
  off: (...args) => {
    hotkeysManager.off(...args);
  },
};
