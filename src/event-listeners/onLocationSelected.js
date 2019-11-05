import core from 'core';
import { isTabletOrMobile } from 'helpers/device';
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

    if (signatureToolButton) {
      if (isTabletOrMobile()) {
        store.dispatch(actions.setActiveHeaderGroup('tools'));
      }

      document.querySelector('[data-element="signatureToolButton"]').click();
    } else {
      const defaultSignatures = document.querySelector('.default-signature');
      const isSignatureOverlayDisabled = selectors.isElementDisabled(store.getState(), 'signatureOverlay');

      if (defaultSignatures && !isSignatureOverlayDisabled) {
        store.dispatch(actions.openElement('signatureOverlay'));
      } else {
        store.dispatch(actions.openElement('signatureModal'));
      }
    }
  }
};
