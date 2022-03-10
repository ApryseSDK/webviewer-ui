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

import Events from 'constants/events';

export default (eventName, listener) => {
  if (eventName === Events.FINISHED_SAVING_PDF) {
    console.warn('FINISHED_SAVING_PDF is deprecated since version 8.3. Please use FILE_DOWNLOADED instead.');
  }
  window.addEventListener(eventName, listener);
};
