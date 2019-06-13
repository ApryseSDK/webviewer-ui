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

import { PRIORITY_TWO } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElements([ 'annotationCommentButton', 'notesPanelButton', 'notesPanel' ], PRIORITY_TWO));
  store.dispatch(actions.setActiveLeftPanel('thumbnailsPanel'));
};
