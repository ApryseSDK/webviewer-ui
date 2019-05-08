/**
 * Sets the print quality. Higher values are higher quality but takes longer to complete and use more memory. The viewer's default quality is 1.
 * @method WebViewer#setPrintQuality
 * @param {number} quality The quality of the document to print
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  instance.setPrintQuality(2);
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setPrintQuality(2);
});
 */

import actions from 'actions';

export default store => quality => {
  store.dispatch(actions.setPrintQuality(quality));
};
