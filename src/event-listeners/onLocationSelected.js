import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

export default store => () => {
  const signatureTool = core.getTool('AnnotationCreateSignature');
  const hasSignature = signatureTool.freeHandAnnot && signatureTool.freeHandAnnot.getPaths().length;

  if (hasSignature) {
    signatureTool.addSignature();
  } else {
    // this condition is usually met when we click on a signature widget but UI doesn't know which signature to draw
    // if signatureToolButton is not disabled then we click on it programmatically 
    // otherwise we check if there are saved signatures in the signature overlay to determine which component we should open
    const signatureToolButton = document.querySelector('[data-element="signatureToolButton"]');

    // we use setTimeout as a work-around here because otherwise if we have saved default signatures,
    // the signatureOverlay will be closed immediately(due to the click handler in App.js) after it's open.
    // the correct way to solve this issue is not close signatureOverlay if we are clicking on a signature widget in that click handler,
    // but that would make the click handler lengthy since we don't have a very good way to check if we're clicking on a signature widget.
    if (signatureToolButton) {
      setTimeout(() => {
        document.querySelector('[data-element="signatureToolButton"]').click();
      }, 0);
    } else {
      const defaultSignatures = document.querySelector('.default-signature');
      const isSignatureOverlayDisabled = selectors.isElementDisabled(store.getState(), 'signatureOverlay');

      if (defaultSignatures && !isSignatureOverlayDisabled) {
        setTimeout(() => {
          store.dispatch(actions.openElement('signatureOverlay'));
        }, 0);
      } else {
        store.dispatch(actions.openElement('signatureModal'));
      }
    }
  }
};
