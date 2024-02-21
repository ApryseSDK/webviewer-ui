import core from 'core';
import selectors from 'selectors';
import actions from 'actions';
import getSignatureDataToStore from 'helpers/getSignatureDataToStore';

export default (dispatch, store) => async () => {
  const signatureTool = core.getTool('AnnotationCreateSignature');
  let savedInitials = signatureTool.getSavedInitials();
  const maxSignaturesCount = selectors.getMaxSignaturesCount(store.getState());
  const numberOfInitialsToRemove = savedInitials.length - maxSignaturesCount;

  if (numberOfInitialsToRemove > 0) {
    // to keep the UI sync with the signatures saved in the tool
    for (let i = 0; i < numberOfInitialsToRemove; i++) {
      signatureTool.deleteSavedInitials(0);
    }
  }

  savedInitials = signatureTool.getSavedInitials();
  const initialsToStore = await getSignatureDataToStore(savedInitials);
  dispatch(actions.setSavedInitials(initialsToStore));
};