export default (annotation, state, stateModel, message) =>
  window.documentViewer
    .getAnnotationManager()
    .updateAnnotationState(annotation, state, stateModel, message);
