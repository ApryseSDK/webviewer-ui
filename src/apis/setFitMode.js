/**
 * Sets the fit mode of the viewer.
 * @method WebViewer#setFitMode
 * @param {WebViewer.FitMode} fitMode Whether or not to set the current user to be an admin.
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;
    var FitMode = instance.FitMode;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.setFitMode(FitMode.FitWidth);
    });
  });
 */

import core from 'core';
import FitMode from 'constants/fitMode';

export default mode => {
  const fitModeToFunctionMap = {
    [FitMode.FitWidth]: core.fitToWidth,
    [FitMode.FitPage]: core.fitToPage,
    [FitMode.Zoom]: core.fitToZoom,
  };
  const fitFunction = fitModeToFunctionMap[mode];

  if (!fitFunction) {
    console.warn(`Unsupported fit mode: ${mode}`);
    return;
  }

  fitFunction();
};
