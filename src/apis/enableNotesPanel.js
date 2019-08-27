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

import actions from 'actions';
import { PRIORITY_TWO } from 'constants/actionPriority';

import disableNotesPanel from './disableNotesPanel';

export default store => (enable = true) => {
  if (enable) {
    store.dispatch(actions.enableElements(['annotationCommentButton', 'notesPanelButton', 'notesPanel'], PRIORITY_TWO));
    store.dispatch(actions.setActiveLeftPanel('notesPanel'));
  } else {
    console.warn('enableNotesPanel(false) is deprecated, please use disableNotesPanel() instead');
    disableNotesPanel(store)();
  }
};