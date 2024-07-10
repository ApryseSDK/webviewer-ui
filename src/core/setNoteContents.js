import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#setNoteContents__anchor
 * @fires annotationChanged(Modify) on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotation, content, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().setNoteContents(annotation, content);
};
