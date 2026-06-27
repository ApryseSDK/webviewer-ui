/**
 * "Remove an event listener for the given WebViewer UI event.
 * @method UI.removeEventListener
 * @param {string} eventName UI event name.
 * @param {function} listener Event handler function that should no longer be bound to the event.
 * @example
WebViewer(...)
  .then(function(instance) {
    const listener = (types, authors, colors, statuses, checkRepliesForAuthorFilter) => {
      console.log(types, authors, colors, statuses, checkRepliesForAuthorFilter);

      instance.UI.removeEventListener(instance.UI.Events.ANNOTATION_FILTER_CHANGED, listener);
    };
    instance.UI.addEventListener(instance.UI.Events.ANNOTATION_FILTER_CHANGED, listener);
  });
 */
import { getEventHandler } from 'helpers/fireEvent';

export default (eventName, listener) => {
  getEventHandler().removeEventListener(eventName, listener);
};
