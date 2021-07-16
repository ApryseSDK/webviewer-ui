/**
 * Return the current tool object.
 * @method UI.getToolMode
 * @return {Core.Tools.Tool} Instance of the current tool
 * @example
WebViewer(...)
  .then(function(instance) {
    console.log(instance.UI.getToolMode().name, instance.UI.getToolMode());
  });
 */

import core from 'core';

export default () => core.getToolMode();