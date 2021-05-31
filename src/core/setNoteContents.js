/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#setNoteContents__anchor
 * @fires annotationChanged(Modify) on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotation, content) => {
  window.documentViewer.getAnnotationManager().setNoteContents(annotation, content);
};
