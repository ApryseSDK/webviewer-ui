import actions from 'actions';
import disableElements from 'src/apis/disableElements';
import enableElements from 'src/apis/enableElements';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';

export default (dispatch, store) => (isReadOnly) => {
  const isCustomUI = selectors.getIsCustomUIEnabled(store.getState());

  dispatch(actions.setViewOnly(isReadOnly));
  if (isReadOnly && !isCustomUI) {
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