/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#applyRedactions__anchor
 * If the redaction annotations overlap with other annotations, it calls deleteAnnotations on the other annotations.
 * See deleteAnnotations.js for any events that are trigger by delete annotations
 */
export default (annotations) =>  {
  return window.docViewer.getAnnotationManager().applyRedactions(annotations);
};
  