/**
 * https://www.pdftron.com/api/web/Core.AnnotationManager.html#createAnnotationReply__anchor
 * @fires addReply on AnnotationManager
 * @see https://www.pdftron.com/api/web/Core.AnnotationManager.html#event:addReply__anchor
 */
export default (annotation, reply) => {
  window.documentViewer.getAnnotationManager().createAnnotationReply(annotation, reply);
};
