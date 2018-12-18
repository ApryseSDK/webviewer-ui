import { PRIORITY_TWO } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElements(['annotationCommentButton', 'notesPanelButton', 'notesPanel'], PRIORITY_TWO));
  store.dispatch(actions.setActiveLeftPanel('thumbnailsPanel'));
};
