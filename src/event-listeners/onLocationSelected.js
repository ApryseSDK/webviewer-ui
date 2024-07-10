import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import SignatureModes from 'constants/signatureModes';

export default (store, documentViewerKey) => async (_, widget) => {
  const signatureTool = core.getTool('AnnotationCreateSignature', documentViewerKey);
  const signatureMode = selectors.getSignatureMode(store.getState());
  const { ToolNames } = window.Core.Tools;

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
    const isCustomizableUI = state.featureFlags.customizableUI;
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
      !selectors.isElementDisabled(state, 'toolbarGroup-Insert') && !isCustomizableUI && store.dispatch(actions.setToolbarGroup('toolbarGroup-Insert', true, 'signatureTools'));
      // this condition is usually met when we click on a signature widget but UI doesn't know which signature to draw
      // we check if there are saved signatures in the signature overlay to determine which component we should open
      store.dispatch(actions.openElement(DataElements.TOOLS_OVERLAY));

      const isToolsOverlayDisabled = selectors.isElementDisabled(state, DataElements.TOOLS_OVERLAY) || selectors.isElementDisabled(state, 'toolsHeader');
      if ((savedSignatures.length === 0 && !requiresInitials) || isToolsOverlayDisabled) {
        store.dispatch(actions.openElement('signatureModal'));
      } else if ((savedInitials.length === 0 && requiresInitials) || isToolsOverlayDisabled) {
        store.dispatch(actions.openElement('signatureModal'));
      } else if (widget && isCustomizableUI) {
        // We set the active ribbon to the one that has the signature tool
        store.dispatch(actions.setActiveGroupedItemWithTool(ToolNames.SIGNATURE));
        const isSignatureListPanelOpen = selectors.isElementOpen(state, DataElements.SIGNATURE_LIST_PANEL);
        // If the active ribbon doesnt have the signature tool, we must switch to one that does
        if (!isSignatureListPanelOpen) {
          store.dispatch(actions.openElement(DataElements.SIGNATURE_LIST_PANEL));
        } else {
          // Signatures and Initials are considered pairs, so we just need to know one index to know the corresponding one.
          const signatureIndex = selectors.getSelectedDisplayedSignatureIndex(state);
          const { annotation: selectedSignature } = requiresInitials ? savedInitials[signatureIndex] : savedSignatures[signatureIndex];
          await signatureTool.setSignature(selectedSignature);
          await signatureTool.addSignature();
        }
      } else if (!isCustomizableUI) {
        core.setToolMode(ToolNames.SIGNATURE);
        const activeSavedSignatureTab = requiresInitials ? DataElements.SAVED_INTIALS_PANEL_BUTTON : DataElements.SAVED_SIGNATURES_PANEL_BUTTON;
        store.dispatch(actions.openElement('toolStylePopup'));
        store.dispatch(actions.setSelectedTab('savedSignatures', activeSavedSignatureTab));
      }
    }
  }
};
