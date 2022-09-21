import core from 'core';
import defaultTool from 'constants/defaultTool';

export default (documentViewerKey) => (signatureAnnotation) => {
  core.setToolMode(defaultTool);
  const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
  signatureToolArray.forEach((tool) => {
    tool.hidePreview();
    tool.annot = null;
  });
  core.selectAnnotation(signatureAnnotation, documentViewerKey);
};
