/**
 * Sets the format for displaying the date when a note is create/modified. A list of formats can be found {@link https://github.com/iamkun/dayjs/blob/master/docs/en/API-reference.md#format-formatstringwithtokens-string dayjs API}.
 * @method WebViewerInstance#setNoteDateFormat
 * @param {string} format The format of date to display
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setNoteDataFormat('DD.MM.YYYY HH:MM');
  });
 */

import actions from 'actions';

export default store => noteDateFormat => {
  store.dispatch(actions.setNoteDateFormat(noteDateFormat));
};
