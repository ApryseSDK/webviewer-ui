import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#deleteAnnotations__anchor
 * @fires annotationSelected on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:annotationSelected__anchor
 * @fires deleteReply on AnnotationManager if the annotation deleted is a reply
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:deleteReply__anchor
 * @fires annotationChanged on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:annotationChanged__anchor
 * @fires notify on DocumentViewer if requires delete notification
 */
export default (annotation, options = undefined, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().deleteAnnotations(annotation, options);
};
