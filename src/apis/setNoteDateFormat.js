/**
 * Sets the format for displaying the date when a note is create/modified. The default format is 'MMM D, LT'.
 * A list of formats can be found {@link https://day.js.org/docs/en/display/format dayjs API}.
 * @method UI.setNoteDateFormat
 * @param {string} format The format of date to display
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setNoteDateFormat('DD.MM.YYYY HH:MM');
  });
 */

import actions from 'actions';

export default (store) => (noteDateFormat) => {
  store.dispatch(actions.setNoteDateFormat(noteDateFormat));
};
