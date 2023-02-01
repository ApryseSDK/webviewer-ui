import actions from 'actions';
import disableElements from 'src/apis/disableElements';
import enableElements from 'src/apis/enableElements';

export default (dispatch, store) => (isReadOnly) => {
  dispatch(actions.setReadOnly(isReadOnly));
  if (isReadOnly) {
    disableElements(store)([
      'documentControl',
      'thumbnailControl',
      'thumbRotateClockwise',
      'thumbDelete',
      'pageManipulationOverlay',
      'pageManipulationOverlayButton',
    ]);
  } else {
    enableElements(store)([
      'documentControl',
      'thumbnailControl',
      'thumbRotateClockwise',
      'thumbDelete',
      'pageManipulationOverlay',
      'pageManipulationOverlayButton',
    ]);
  }
};