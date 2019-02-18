import core from 'core';
import actions from 'actions';

export default dispatch => () => {
  const signatureTool = core.getTool('AnnotationCreateSignature');

  if (signatureTool.getSignaturePaths().length) {
    signatureTool.addSignature();
  } else {
    // this condition is usually met when we click on a signature widget but UI doesn't know which signature to draw
    dispatch(actions.openElement('signatureToolButton'));
  }
};
