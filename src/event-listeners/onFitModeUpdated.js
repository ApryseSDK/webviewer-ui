import core from 'core';
import actions from 'actions';
import { isAndroid } from 'helpers/device';

export default dispatch => (e, fitMode) => {
  const docViewer = core.getDocumentViewer();
  
  if (fitMode === docViewer.FitMode.Zoom) {
    dispatch(actions.setFitMode('Zoom'));
  } else if (fitMode === docViewer.FitMode.FitWidth) {
    dispatch(actions.setFitMode('FitWidth'));
  } else if (fitMode === docViewer.FitMode.FitPage) {
    // In Android, if you focus on an input field, it brings up virtual keyboard,
    // and page gets re-rendered, which blurs out.
    // To prevent that, we change the fit mode to Zoom.
    if (isAndroid) {
      core.fitToZoom();
    }
    dispatch(actions.setFitMode('FitPage'));
  }

  $(document).trigger('fitModeChanged', [fitMode]);
};