export default (primaryAnnotation, annotationsToGroup) =>
  window.docViewer.getAnnotationManager().groupAnnotations(
    primaryAnnotation,
    annotationsToGroup,
  );
