/* eslint-disable no-unused-vars */
import core from 'core';
import defaultTool from 'constants/defaultTool';

export default (documentViewerKey) => (signatureAnnotation) => {
  core.setToolMode(defaultTool);
  const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
  signatureToolArray.forEach((tool) => {
    tool.hidePreview();
    tool.annot = null;
  });
  // This had not been working and was fixed when the signature list panel was added
  // however it now causes issues with the annotation popup being out of place. Once that is
  // fixed this should be re-enabled
  // core.selectAnnotation(signatureAnnotation, documentViewerKey);
};
