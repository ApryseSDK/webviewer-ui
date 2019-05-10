/**
 * Sets the fit mode of the viewer.
 * @method WebViewer#setFitMode
 * @param {CoreControls.ReaderControl#FitMode} fitMode Whether or not to set the current user to be an admin.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setFitMode(instance.FitMode.FitWidth);
});
 */

import core from 'core';
import FitMode from 'constants/fitMode';

export default mode =>  {
  const fitModeToFunctionMap = {
    [FitMode.FitWidth]: core.fitToWidth,
    [FitMode.FitPage]: core.fitToPage,
    [FitMode.Zoom]: core.fitToZoom
  };
  const fitFunction = fitModeToFunctionMap[mode];

  if (!fitFunction) {
    console.warn('Unsupported fit mode: ' + mode);
    return;
  }

  fitFunction();
};
