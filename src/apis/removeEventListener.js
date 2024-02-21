/**
 * "Remove an event listener for the given WebViewer UI event.
 * @method UI.removeEventListener
 * @param {string} eventName UI event name.
 * @param {function} listener Event handler function that should no longer be bound to the event.
 * @example
WebViewer(...)
  .then(function(instance) {
    const listener = e => {
      const { types, authors, colors } = e.detail;
      console.log(types, authors, colors);

      instance.UI.removeEventListener(instance.UI.Events.ANNOTATION_FILTER_CHANGED, listener);
    };
    instance.UI.addEventListener(instance.UI.Events.ANNOTATION_FILTER_CHANGED, listener);
  });
 */
import { getInstanceNode } from 'helpers/getRootNode';

export default (eventName, listener) => {
  getInstanceNode().removeEventListener(eventName, listener);
};
