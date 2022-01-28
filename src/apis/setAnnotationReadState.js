import actions from 'actions';

/**
 * Set the read/unread state of an annotation. The default state of annotations is read.
 * @method UI.setAnnotationReadState
 * @param {object} options
 * @param {boolean} options.isRead whether setting the annotation to read state; false for setting it as unread.
 * @param {string} options.annotationId Id of the annotation to be set.
 * @example
 WebViewer(...)
  .then(function(instance) {
    instance.UI.setAnnotationReadState({ isRead: true, annotationId: 'test-annotation-id' });
  });
 */
export default store => ({ isRead, annotationId }) => {
  if (typeof annotationId !== 'string') {
    console.warn('Invalid annotation ID');
    return;
  }
  store.dispatch(actions.setAnnotationReadState({ isRead, annotationId }));
};
