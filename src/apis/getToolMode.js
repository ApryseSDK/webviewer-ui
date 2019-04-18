/**
 * Return the current tool object.
 * @method WebViewer#getToolMode
 * @return {Tools} Instance of the current tool
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

console.log(instance.getToolMode().name, instance.getToolMode());
 */

import core from 'core';

export default () => core.getToolMode();