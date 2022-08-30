/**
 * Sets the format for displaying the date when a note is printed. A list of formats can be found {@link https://github.com/iamkun/dayjs/blob/master/docs/en/API-reference.md#format-formatstringwithtokens-string dayjs API}.
 * @method UI.setPrintedNoteDateFormat
 * @param {string} format The format of date to display
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setPrintedNoteDateFormat('DD.MM.YYYY HH:MM');
  });
 */

import actions from 'actions';

export default (store) => (noteDateFormat) => {
  store.dispatch(actions.setPrintedNoteDateFormat(noteDateFormat));
};
