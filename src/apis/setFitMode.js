/**
 * Sets the fit mode of the viewer.
 * @method UI.setFitMode
 * @param {string} fitMode Fit mode of WebViewer.
 * @see UI.FitMode
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.Core.documentViewer;
    var FitMode = instance.UI.FitMode;

    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      instance.UI.setFitMode(FitMode.FitWidth);
    });
  });
 */

import core from 'core';
import FitMode from 'constants/fitMode';

export default (mode) => {
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
