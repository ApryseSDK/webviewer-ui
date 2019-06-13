/**
 * Sets the format for displaying the date when a note is create/modified. A list of formats can be found {@link https://github.com/iamkun/dayjs/blob/master/docs/en/API-reference.md#format-formatstringwithtokens-string dayjs API}.
 * @method WebViewer#setNoteDateFormat
 * @param {string} format The format of date to display
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.setNoteDataFormat('DD.MM.YYYY HH:MM');
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setNoteDataFormat('DD.MM.YYYY HH:MM');
});
 */

import actions from 'actions';

export default store => noteDateFormat => {
  store.dispatch(actions.setNoteDateFormat(noteDateFormat));
};
