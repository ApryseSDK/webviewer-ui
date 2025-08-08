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
      const ribbonAssociatedWithTool = selectors.getRibbonAssociatedWithTool(state, ToolNames.SIGNATURE);
      const activeCustomRibbon = selectors.getActiveCustomRibbon(state);
      const toolsAssociatedWithRibbon = selectors.getToolsAssociatedWithRibbon(state, activeCustomRibbon);
      // set active ribbon that has the signature tool
      if (isCustomizableUI && !toolsAssociatedWithRibbon.includes(ToolNames.SIGNATURE) && ribbonAssociatedWithTool) {
        store.dispatch(actions.setActiveCustomRibbon(ribbonAssociatedWithTool));
      }

      if ((savedSignatures.length === 0 && !requiresInitials) || isToolsOverlayDisabled) {
        store.dispatch(actions.openElement('signatureModal'));
      } else if ((savedInitials.length === 0 && requiresInitials) || isToolsOverlayDisabled) {
        store.dispatch(actions.openElement('signatureModal'));
      } else if (widget && isCustomizableUI) {
        core.setToolMode(ToolNames.SIGNATURE);
        const isSignatureListPanelOpen = selectors.isElementOpen(state, DataElements.SIGNATURE_LIST_PANEL);
        const signatureListPanelInFlyout = selectors.getIsPanelInFlyout(state, DataElements.SIGNATURE_LIST_PANEL);
        const isSignatureListFlyoutOpen = selectors.isElementOpen(state, signatureListPanelInFlyout?.dataElement);
        const shouldOpenSignatureListPanel = !signatureListPanelInFlyout && !isSignatureListPanelOpen;
        const shouldOpenSignatureListFlyout = signatureListPanelInFlyout && !isSignatureListFlyoutOpen;

        if (shouldOpenSignatureListFlyout) {
          store.dispatch(actions.openFlyout(signatureListPanelInFlyout.dataElement, ToolNames.SIGNATURE));
        } else if (shouldOpenSignatureListPanel) {
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
