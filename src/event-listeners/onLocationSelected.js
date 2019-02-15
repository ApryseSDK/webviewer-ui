import core from 'core';

export default () => {
  const signatureTool = core.getTool('AnnotationCreateSignature');

  if (signatureTool.getSignaturePaths().length) {
    signatureTool.addSignature();
  } else {
    // this condition is usually met when we click on a signature widget but UI doesn't know which signature to draw
    prepareSignature();
  }
};

const prepareSignature = () => {
  document.querySelector('[data-element=signatureToolButton]').click();
};
