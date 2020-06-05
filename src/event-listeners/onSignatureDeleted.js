import core from 'core';
import actions from 'actions';
import getSignatureDataToStore from 'helpers/getSignatureDataToStore';

export default dispatch => async() => {
  const signatureTool = core.getTool('AnnotationCreateSignature');
  const coreSavedSignatures = signatureTool.getSavedSignatures();
  const newSavedSignatures = await getSignatureDataToStore(coreSavedSignatures);
  dispatch(actions.setSavedSignatures(newSavedSignatures));
};
