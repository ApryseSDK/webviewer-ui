import core from 'core';
import defaultTool from 'constants/defaultTool';

export default () => (e, signatureAnnotation) => {
  core.setToolMode(defaultTool);
  core.getTool('AnnotationCreateSignature').hidePreview();
  setTimeout(() => {
    core.selectAnnotation(signatureAnnotation);
  }, 0);
};
