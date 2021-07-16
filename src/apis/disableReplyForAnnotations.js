/**
 * Disable reply for annotations determined by the function passed in as parameter
 * @method UI.disableReplyForAnnotations
 * @param {UI.storeisReplyDisabled} isReplyDisabled Function that takes an annotation and returns if the reply of the annotation should be disabled.
 * @example
 WebViewer(...)
  .then(function(instance) {
    // disable reply for all Freehand annotations
    instance.UI.disableReplyForAnnotations(function(annotation) {
      return annotation instanceof instance.Annotations.FreeHandAnnotation;
    });
  });
 */
/**
 * Callback that gets passed to {@link UI.disableReplyForAnnotations disableReplyForAnnotations}
 * @callback UI.storeisReplyDisabled
 * @param {Core.Annotations.Annotation} annotation Annotation object
 * @returns {boolean} Whether the reply of the annotation should be disabled.
 */
import actions from 'actions';

export default store => isReplyDisabledFunc => {
  store.dispatch(actions.disableReplyForAnnotations(isReplyDisabledFunc));
};