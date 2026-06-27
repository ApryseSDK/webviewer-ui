import core from 'core';

export default (annotation, state, stateModel, message, documentViewerKey) => core.getDocumentViewer(documentViewerKey)
  .getAnnotationManager()
  .updateAnnotationState(annotation, state, stateModel, message);
