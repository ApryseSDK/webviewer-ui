import core from 'core';
import actions from 'actions';

export default dispatch => (e, fitMode) => {
  const docViewer = core.getDocumentViewer();
  
  if (fitMode === docViewer.FitMode.Zoom) {
    dispatch(actions.setFitMode('Zoom'));
  } else if (fitMode === docViewer.FitMode.FitWidth) {
    dispatch(actions.setFitMode('FitWidth'));
  } else if (fitMode === docViewer.FitMode.FitPage) {
    dispatch(actions.setFitMode('FitPage'));
  }

  $(document).trigger('fitModeChanged');
};