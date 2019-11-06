/**
 * Disable reply for annotations determined by the function passed in as parameter
 * @method WebViewer#disableReplyForAnnotations
 * @param {WebViewer~isReplyDisabled} isReplyDisabled Function that takes an annotation and returns if the reply of the annotation should be disabled.
 * @example // 5.1 and after
 WebViewer(...)
  .then(function(instance) {
    // disable reply for all Freehand annotations
    instance.disableReplyForAnnotations(function(annotation) {
      return annotation instanceof instance.Annotations.FreeHandAnnotation;
    });
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();

  // disable reply for all Freehand annotations
  instance.disableReplyForAnnotations(function(annotation) {
    return annotation instanceof instance.Annotations.FreeHandAnnotation;
  });
});
 */
/**
 * Callback that gets passed to {@link WebViewer#disableReplyForAnnotations disableReplyForAnnotations}
 * @callback WebViewer~isReplyDisabled
 * @param {Annotations} annotation Annotation object
 * @returns {boolean} Whether the reply of the annotation should be disabled.
 */
import actions from 'actions';

export default store => isReplyDisabledFunc => {
  store.dispatch(actions.disableReplyForAnnotations(isReplyDisabledFunc));
};