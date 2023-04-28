import core from 'core';

export default (primaryAnnotation, annotationsToGroup, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getAnnotationManager().groupAnnotations(
  primaryAnnotation,
  annotationsToGroup,
);
