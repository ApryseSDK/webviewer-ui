import core from 'core';

export default (annotation, state, stateModel, message, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey)
  .getAnnotationManager()
  .updateAnnotationState(annotation, state, stateModel, message);
