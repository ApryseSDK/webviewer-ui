import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import getSignatureDataToStore from 'helpers/getSignatureDataToStore';

export default (dispatch, store) => async annotations => {
  const savedSignatures = selectors.getSavedSignatures(store.getState());
  const maxSignaturesCount = selectors.getMaxSignaturesCount(store.getState());
  const numberOfSignaturesToRemove = savedSignatures.length + annotations.length - maxSignaturesCount;
  let newSavedSignatures = [...savedSignatures];

  const signatureTool = core.getTool('AnnotationCreateSignature');
  if (numberOfSignaturesToRemove > 0) {
    // to keep the UI sync with the signatures saved in the tool
    for (let i = 0; i < numberOfSignaturesToRemove; i++) {
      signatureTool.deleteSavedSignature(0);
    }

    newSavedSignatures.splice(0, numberOfSignaturesToRemove);
  }

  const signaturesToStore = await getSignatureDataToStore(annotations);
  newSavedSignatures = newSavedSignatures.concat(signaturesToStore);

  dispatch(actions.setSavedSignatures(newSavedSignatures));
};

