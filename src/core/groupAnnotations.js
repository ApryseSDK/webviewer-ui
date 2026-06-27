import core from 'core';

export default (primaryAnnotation, annotationsToGroup, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().groupAnnotations(
  primaryAnnotation,
  annotationsToGroup,
);
