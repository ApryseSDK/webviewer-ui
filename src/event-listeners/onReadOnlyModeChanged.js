import actions from 'actions';
import disableElements from 'src/apis/disableElements';
import enableElements from 'src/apis/enableElements';
import DataElements from 'constants/dataElement';

export default (dispatch, store) => (isReadOnly) => {
  dispatch(actions.setReadOnly(isReadOnly));
  if (isReadOnly) {
    disableElements(store)([
      'documentControl',
      'thumbnailControl',
      'thumbRotateClockwise',
      'thumbDelete',
      DataElements.PAGE_MANIPULATION_OVERLAY,
      DataElements.PAGE_MANIPULATION_OVERLAY_BUTTON
    ]);
  } else {
    enableElements(store)([
      'documentControl',
      'thumbnailControl',
      'thumbRotateClockwise',
      'thumbDelete',
      DataElements.PAGE_MANIPULATION_OVERLAY,
      DataElements.PAGE_MANIPULATION_OVERLAY_BUTTON
    ]);
  }
};