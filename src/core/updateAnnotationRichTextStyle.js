import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#updateAnnotationRichTextStyle__anchor
 * @fires annotationChanged on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 */
export default (annotation, callback, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().updateAnnotationRichTextStyle(annotation, callback);
};
