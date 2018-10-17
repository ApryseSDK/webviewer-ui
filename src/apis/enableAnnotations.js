import core from 'core';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import { LOW_PRIORITY } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) =>  {
  const elements = [
    'notesPanel',
    'notesPanelButton',
    ...getAnnotationRelatedElements(store.getState())
  ];

  if (enable) {
    store.dispatch(actions.enableElements(elements, LOW_PRIORITY));
    core.showAnnotations(core.getAnnotationsList());
  } else {
    store.dispatch(actions.disableElements(elements, LOW_PRIORITY));
    core.hideAnnotations(core.getAnnotationsList());
  }
};
