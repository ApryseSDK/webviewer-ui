export default (annotation, state, stateModel, message) =>
  window.docViewer
    .getAnnotationManager()
    .updateAnnotationState(annotation, state, stateModel, message);
