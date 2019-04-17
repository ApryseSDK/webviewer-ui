/**
 * Sets the format for displaying the date when a note is create/modified. A list of formats can be found {@link https://github.com/iamkun/dayjs/blob/master/docs/en/API-reference.md#format-formatstringwithtokens-string dayjs API}.
 * @method WebViewer#setNoteDateFormat
 * @param {string} format The format of date to display
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.setNoteDataFormat('DD.MM.YYYY HH:MM');
 */

import actions from 'actions';

export default store => noteDateFormat => {
  store.dispatch(actions.setNoteDateFormat(noteDateFormat));
};
