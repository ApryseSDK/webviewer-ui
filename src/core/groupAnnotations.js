export default (primaryAnnotation, annotationsToGroup) =>
  window.documentViewer.getAnnotationManager().groupAnnotations(
    primaryAnnotation,
    annotationsToGroup,
  );
