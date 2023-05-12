import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import SignatureModes from 'constants/signatureModes';

export default (store, documentViewerKey) => async (_, widget) => {
  const signatureTool = core.getTool('AnnotationCreateSignature', documentViewerKey);
  const signatureMode = selectors.getSignatureMode(store.getState());

  if (!(await signatureTool.isEmptySignature()) && signatureMode === SignatureModes.FULL_SIGNATURE) {
    await signatureTool.addSignature();
  } else if (!(await signatureTool.isEmptyInitialsSignature()) && signatureMode === SignatureModes.INITIALS) {
    await signatureTool.addInitials();
  } else {
    let requiresInitials = false;
    if (widget) {
      requiresInitials = widget.requiresInitials();
    }

    const state = store.getState();
    const isSavedSignaturesTabEnabled = selectors.isSavedSignaturesTabEnabled(state);
    const signatureMode = requiresInitials ? SignatureModes.INITIALS : SignatureModes.FULL_SIGNATURE;
    const savedSignatures = selectors.getSavedSignatures(state);
    const savedInitials = selectors.getSavedInitials(state);
    store.dispatch(actions.setSignatureMode(signatureMode));
    if (isSavedSignaturesTabEnabled) {
      const noSignaturesSaved = (savedInitials.length === 0 && requiresInitials) || (savedSignatures.length === 0 && !requiresInitials);
      if (noSignaturesSaved) {
        store.dispatch(actions.setSelectedTab('signatureModal', 'inkSignaturePanelButton'));
      } else {
        store.dispatch(actions.setSelectedTab('signatureModal', 'savedSignaturePanelButton'));
      }
      store.dispatch(actions.openElement('signatureModal'));
    } else {
      !selectors.isElementDisabled(state, 'toolbarGroup-Insert') && store.dispatch(actions.setToolbarGroup('toolbarGroup-Insert'));
      // this condition is usually met when we click on a signature widget but UI doesn't know which signature to draw
      // we check if there are saved signatures in the signature overlay to determine which component we should open
      store.dispatch(actions.setActiveToolGroup('signatureTools'));
      store.dispatch(actions.openElement('toolsOverlay'));

      const isToolsOverlayDisabled = selectors.isElementDisabled(state, 'toolsOverlay') || selectors.isElementDisabled(state, 'toolsHeader');
      if ((savedSignatures.length === 0 && !requiresInitials) || isToolsOverlayDisabled) {
        store.dispatch(actions.openElement('signatureModal'));
      } else if ((savedInitials.length === 0 && requiresInitials) || isToolsOverlayDisabled) {
        store.dispatch(actions.openElement('signatureModal'));
      } else {
        core.setToolMode(window.Core.Tools.ToolNames.SIGNATURE);
        const activeSavedSignatureTab = requiresInitials ? DataElements.SAVED_INTIALS_PANEL_BUTTON : DataElements.SAVED_SIGNATURES_PANEL_BUTTON;
        store.dispatch(actions.openElement('toolStylePopup'));
        store.dispatch(actions.setSelectedTab('savedSignatures', activeSavedSignatureTab));
      }
    }
  }
};
