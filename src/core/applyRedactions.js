/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#applyRedactions__anchor
 * @fires deleteAnnotations on AnnotationManger if redaction is on top of another annotation
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#deleteAnnotations__anchor
 * @fires annotationChanged on AnnotationManager if delete was fired
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:annotationChanged__anchor
 * @fires notify on DocumentViewer if requires delete notification
 */
export default annotations =>  {
    window.docViewer.getAnnotationManager().applyRedactions(annotations);
  };
  