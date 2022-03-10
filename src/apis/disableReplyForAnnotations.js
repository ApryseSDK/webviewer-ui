/**
 * Disable reply for annotations if the callback function returns true. The callback function gets evaluated when the Comments panel is open, an annotation is selected, and the selected annotation has a comment.
 * Only one callback function will be stored and invoked. If multiple criteria is needed to disable replies you must write them in a single callback function.
 * @method UI.disableReplyForAnnotations
 * @param {UI.disableReplyForAnnotationsCallback} isReplyDisabledCallback Callback function that returns true if reply will be disabled for the annotation passed in. False otherwise.
 * @example
 WebViewer(...)
  .then(instance => {

    // disable reply for Freehand annotations
    instance.UI.disableReplyForAnnotations((annotation) => {
      return annotation instanceof instance.Annotations.FreeHandAnnotation;
    });

    // disable reply for annotations authored by Guest
    instance.UI.disableReplyForAnnotations((annotation) => {
      return annotation['Author'] === 'Guest';
    });

    // disable reply for annotations created more than 10 seconds ago
    instance.UI.disableReplyForAnnotations((annotation) => {
      const createdDate = new Date(annotation['DateCreated']);
      const todayDate = new Date();
      return (todayDate - createdDate) > 10000;
    });
  });
 */

/**
 * Callback that gets passed to {@link UI.disableReplyForAnnotations disableReplyForAnnotations}.
 * @callback UI.disableReplyForAnnotationsCallback
 * @param {Core.Annotations.Annotation} annotation Annotation object
 * @returns {boolean} True if replies for the annotation passed in should be disabled. False otherwise.
 */

import actions from 'actions';

export default store => isReplyDisabledFunc => {
  store.dispatch(actions.disableReplyForAnnotations(isReplyDisabledFunc));
};