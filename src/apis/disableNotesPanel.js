/**
 * Disables notes panel feature, affecting any elements related to notes panel.
 * @method WebViewer#disableNotesPanel
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.disableNotesPanel();
 */

import { PRIORITY_TWO } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElements(['annotationCommentButton', 'notesPanelButton', 'notesPanel'], PRIORITY_TWO));
  store.dispatch(actions.setActiveLeftPanel('thumbnailsPanel'));
};
