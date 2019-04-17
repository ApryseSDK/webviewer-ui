/**
 * Sets the layout mode of the viewer.
 * @method WebViewer#setLayoutMode
 * @param {CoreControls.ReaderControl#LayoutMode} layoutMode Layout mode of WebViewer.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.setLayoutMode(instance.LayoutMode.FacingContinuous);
 */

import core from 'core';

export default mode =>  {
  core.setDisplayMode(mode);
};
