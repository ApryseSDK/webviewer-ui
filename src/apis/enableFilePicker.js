/**
 * Enables file picker feature, affecting the Open files button in menu overlay and shortcut to open local files (ctrl/cmd + o).
 * @method WebViewer#enableFilePicker
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableFilePicker();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableFilePicker();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enableFilePicker()',
      'enableFeatures([instance.Feature.FilePicker])',
      '6.0',
    );
    enableFeatures(store)([Feature.Measurement]);
  } else {
    warnDeprecatedAPI(
      'enableFilePicker(false)',
      'disableFeatures([instance.Feature.FilePicker])',
      '6.0',
    );
    disableFeatures(store)([Feature.FilePicker]);
  }
};