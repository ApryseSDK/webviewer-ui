/**
 * Disable reply for annotations determined by the function passed in as parameter
 * @param Function that takes an annotation and returns if the reply of this annotations should be disabled.
 * @example
 WebViewer(...)
  .then(function(instance) {
    /
    instance.disableReplyForAnnotations(function(annotation) {
      return annotation instanceof instance.Annotations.FreeHandAnnotation;
    });
  });
 */
import actions from 'actions';

export default store => isReplyDisabledFunc => {
  store.dispatch(actions.disableReplyForAnnotations(isReplyDisabledFunc));
};