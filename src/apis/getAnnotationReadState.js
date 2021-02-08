import selectors from 'selectors';
import core from 'core';

/**
 * Return the read/unread state of an annotation. True for read, false for unread.
 * @method WebViewerInstance#getAnnotationReadState
 * @param {string} annotationId Id of the annotation.
 * @return {boolean} Whether the annotation is read.
 * @throws Will throw an error if the annotation with the given ID does not exist.
 * @example
WebViewer(...)
  .then(function(instance) {
    const isAnnotationRead = instance.getAnnotationReadState('test-annotation-id');
 */
export default store => annotationId => {
  if (typeof annotationId !== 'string') {
    console.warn('Invalid annotation ID');
    return;
  }
  const annotation = core.getAnnotationManager().getAnnotationById(annotationId);
  if (!annotation) {
    throw new Error(`Annotation with ID ${annotationId} not found.`);
  }
  const unreadAnnotationIdSet = selectors.getUnreadAnnotationIdSet(store.getState());
  return unreadAnnotationIdSet.has(annotationId);
};
