/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#updateAnnotationRichTextStyle__anchor
 * @fires annotationChanged on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotation, callback) => {
  window.documentViewer.getAnnotationManager().updateAnnotationRichTextStyle(annotation, callback);
};
