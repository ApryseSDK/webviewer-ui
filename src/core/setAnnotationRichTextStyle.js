import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#setAnnotationRichTextStyle__anchor
 * @fires annotationChanged(Modify) on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotation, style, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().setAnnotationRichTextStyle(annotation, style);
};
