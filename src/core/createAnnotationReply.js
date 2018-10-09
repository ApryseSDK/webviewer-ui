/**
 * https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#createAnnotationReply__anchor
 * @fires addReply on AnnotationManager
 * @see https://www.pdftron.com/api/web/CoreControls.AnnotationManager.html#event:addReply__anchor
 */
export default (annotation, reply) =>  {
  window.docViewer.getAnnotationManager().createAnnotationReply(annotation, reply);
};
