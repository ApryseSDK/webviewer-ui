/**
 * Add an event listener for the given WebViewer UI event.
 *
 * Listeners receive the event payload as positional arguments. See {@link UI.Events} for the
 * argument list of each event.
 * @method UI.addEventListener
 * @param {string} eventName UI event name.
 * @param {function} listener Callback function that will be invoked when the event is dispatched.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.addEventListener(instance.UI.Events.ANNOTATION_FILTER_CHANGED, (types, authors, colors, statuses, checkRepliesForAuthorFilter) => {
      console.log(types, authors, colors, statuses, checkRepliesForAuthorFilter);
    });

    instance.UI.addEventListener(instance.UI.Events.VISIBILITY_CHANGED, (dataElement, isVisible) => {
      console.log(dataElement, isVisible);
    });
  });
 */
import { getEventHandler } from 'helpers/fireEvent';

export default (eventName, listener) => {
  getEventHandler().addEventListener(eventName, listener);
};
