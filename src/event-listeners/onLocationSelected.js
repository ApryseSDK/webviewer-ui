import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

export default store => () => {
  const signatureTool = core.getTool('AnnotationCreateSignature');
  if (!signatureTool.isEmptySignature()) {
    signatureTool.addSignature();
  } else {
    !selectors.isElementDisabled(store.getState(), 'toolbarGroup-Insert') && store.dispatch(actions.setToolbarGroup('toolbarGroup-Insert'));
    // this condition is usually met when we click on a signature widget but UI doesn't know which signature to draw
    // we check if there are saved signatures in the signature overlay to determine which component we should open
    store.dispatch(actions.setActiveToolGroup('signatureTools'));
    store.dispatch(actions.openElement('toolsOverlay'));

    const isToolsOverlayDisabled = selectors.isElementDisabled(store.getState(), 'toolsOverlay') || selectors.isElementDisabled(store.getState(), 'toolsHeader');
    const savedSignatures = selectors.getSavedSignatures(store.getState(), 'signatureOverlay');
    if (savedSignatures.length === 0 || isToolsOverlayDisabled) {
      store.dispatch(actions.openElement('signatureModal'));
    } else {
      store.dispatch(actions.openElement('toolStylePopup'));
    }
  }
};
