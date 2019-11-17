/**
 * Return the current tool object.
 * @method WebViewer#getToolMode
 * @return {Tools} Instance of the current tool
 * @example
WebViewer(...)
  .then(function(instance) {
    console.log(instance.getToolMode().name, instance.getToolMode());
  });
 */

import core from 'core';

export default () => core.getToolMode();