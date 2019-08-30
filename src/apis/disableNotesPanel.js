/**
 * Disables notes panel feature, affecting any elements related to notes panel.
 * @method WebViewer#disableNotesPanel
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.disableNotesPanel();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.disableNotesPanel();
});
 */

import Feature from 'constants/feature';
import warnDeprecatedAPI from 'helpers/warnDeprecatedAPI';
import disableFeatures from './disableFeatures';

export default store => () => {
  warnDeprecatedAPI(
    'disableNotesPanel()',
    'disableFeatures([instance.Feature.NotesPanel])',
    '6.0',
  );
  disableFeatures(store)([Feature.NotesPanel]);
};
