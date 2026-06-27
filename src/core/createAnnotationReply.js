import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.AnnotationManager.html#createAnnotationReply__anchor
 * @fires addReply on AnnotationManager
 * @see https://docs.apryse.com/api/web/Core.AnnotationManager.html#event:addReply__anchor
 */
export default (annotation, reply, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).getAnnotationManager().createAnnotationReply(annotation, reply);
};
