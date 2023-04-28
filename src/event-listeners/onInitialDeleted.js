import core from 'core';
import actions from 'actions';
import getSignatureDataToStore from 'helpers/getSignatureDataToStore';

export default (dispatch) => async () => {
  const signatureTool = core.getTool('AnnotationCreateSignature');
  const savedInitials = signatureTool.getSavedInitials();
  const newSavedInitials = await getSignatureDataToStore(savedInitials);
  dispatch(actions.setSavedInitials(newSavedInitials));
};
