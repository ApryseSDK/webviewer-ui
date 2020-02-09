import core from 'core';
import defaultTool from 'constants/defaultTool';

export default () => signatureAnnotation => {
  // core.setToolMode(defaultTool);
  core.getTool('AnnotationCreateSignature').hidePreview();
  core.selectAnnotation(signatureAnnotation);
};
