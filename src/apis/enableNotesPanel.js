/**
 * Enables notes panel feature, affecting any elements related to notes panel.
 * @method WebViewer#enableNotesPanel
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enableNotesPanel();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableNotesPanel();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import enableFeatures from './enableFeatures';
import disableFeatures from './disableFeatures';

export default store => (enable = true) => {
  if (enable) {
    warnDeprecatedAPI(
      'enableNotesPanel()',
      'enableFeatures([instance.Feature.NotesPanel])',
      '6.0',
    );
    enableFeatures(store)([Feature.Measurement]);
  } else {
    warnDeprecatedAPI(
      'enableNotesPanel(false)',
      'disableFeatures([instance.Feature.NotesPanel])',
      '6.0',
    );
    disableFeatures(store)([Feature.NotesPanel]);
  }
};