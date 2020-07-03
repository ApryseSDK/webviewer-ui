import action from 'actions';

/**
 * Adds a custom overlay to annotations on mouseHover, overriding the existing overlay.
 * @method WebViewerInstance#setAnnotationContentOverlayHandler
 * @param {function} customOverlayHandler a function that takes an annotation and returns a DOM Element, which is rendered as a tooltip when hovering over the annotation
 *  * @example
WebViewer(...)
  .then(function(instance) {
    instance.setAnnotationContentOverlayHandler(annotation => {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(`Created by: ${annotation.Author}`));
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createTextNode(`Created on ${annotation.DateCreated}`));
        return div;
    });
  });
 */

export default store => annotationContentOverlayHandler => {
  store.dispatch(action.setAnnotationContentOverlayHandler(annotationContentOverlayHandler));
};