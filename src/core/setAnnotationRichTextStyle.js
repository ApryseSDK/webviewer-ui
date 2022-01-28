/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setAnnotationRichTextStyle__anchor
 * @fires annotationChanged(Modify) on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotation, style) => {
  window.documentViewer.getAnnotationManager().setAnnotationRichTextStyle(annotation, style);
};
