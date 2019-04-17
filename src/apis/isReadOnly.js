/**
 * Returns whether the current mode is read only.
 * @method WebViewer#isReadOnly
 * @returns {boolean} Whether the current mode is read only.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
console.log(instance.isReadOnly());
 */

import core from 'core';

export default () => !!core.getIsReadOnly();
