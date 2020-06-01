import core from 'core';
import defaultTool from 'constants/defaultTool';

export default () => signatureAnnotation => {
  core.setToolMode(defaultTool);
  core.getTool('AnnotationCreateSignature').hidePreview();
  core.selectAnnotation(signatureAnnotation);
  const signatureTool = core.getTool('AnnotationCreateSignature');

  signatureTool.annot = null;
};
