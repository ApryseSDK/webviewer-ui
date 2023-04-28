import core from 'core';
import defaultTool from 'constants/defaultTool';

export default (documentViewerKey) => (rubberStampAnnotation) => {
  core.setToolMode(defaultTool);
  core.getToolsFromAllDocumentViewers('AnnotationCreateRubberStamp').forEach((tool) => tool.hidePreview());
  core.selectAnnotation(rubberStampAnnotation, documentViewerKey);
};
