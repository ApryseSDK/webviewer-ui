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
