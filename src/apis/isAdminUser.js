/**
 * Returns whether the current user is admin.
 * @method WebViewer#isAdminUser
 * @returns {boolean} Whether the user is admin.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
console.log(instance.isAdminUser());
 */

import core from 'core';

export default () => !!core.getIsAdminUser();