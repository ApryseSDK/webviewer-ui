/**
 * Add an event listener for the given WebViewer UI event.
 * @method UI.addEventListener
 * @param {string} eventName UI event name.
 * @param {function} listener Callback function that will be invoked when the event is dispatched.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.addEventListener(instance.UI.Events.ANNOTATION_FILTER_CHANGED, e => {
      const { types, authors, colors } = e.detail;
      console.log(types, authors, colors);
    });
  });
 */

export default (eventName, listener) => {
  window.addEventListener(eventName, listener);
};
