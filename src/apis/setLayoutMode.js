/**
 * Sets the layout mode of the viewer.
 * @method CoreControls.ReaderControl#setLayoutMode
 * @param {CoreControls.ReaderControl#LayoutMode} layoutMode Layout mode of WebViewer.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setLayoutMode(instance.LayoutMode.FacingContinuous);
});
 */

import core from 'core';

export default mode =>  {
  core.setDisplayMode(mode);
};
