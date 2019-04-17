/**
 * Return the current username.
 * @method WebViewer#getAnnotationUser
 * @return {string} Current username
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
console.log(instance.getAnnotationUser());
 */

import core from 'core';

export default () => core.getCurrentUser();
