/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#setNoteContents__anchor
 * @fires annotationChanged(Modify) on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotation, content) =>  {
  window.docViewer.getAnnotationManager().setNoteContents(annotation, content);
};
