import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import getSignatureDataToStore from 'helpers/getSignatureDataToStore';

export default (dispatch, store) => async () => {
  const signatureTool = core.getTool('AnnotationCreateSignature');
  let savedSignatures = signatureTool.getSavedSignatures();
  const maxSignaturesCount = selectors.getMaxSignaturesCount(store.getState());
  const numberOfSignaturesToRemove = savedSignatures.length - maxSignaturesCount;

  if (numberOfSignaturesToRemove > 0) {
    // to keep the UI sync with the signatures saved in the tool
    for (let i = 0; i < numberOfSignaturesToRemove; i++) {
      signatureTool.deleteSavedSignature(0);
    }
  }

  savedSignatures = signatureTool.getSavedSignatures();
  const signaturesToStore = await getSignatureDataToStore(savedSignatures);
  dispatch(actions.setSavedSignatures(signaturesToStore));
};