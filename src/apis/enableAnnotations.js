import core from 'core';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import actions from 'actions';

export default store => (enable = true) =>  {
  const elements = [
    'notesPanel',
    'notesPanelButton',
    ...getAnnotationRelatedElements(store.getState())
  ];

  if (enable) {
    store.dispatch(actions.enableElements(elements));
    core.showAnnotations(core.getAnnotationsList());
  } else {
    store.dispatch(actions.disableElements(elements));
    core.hideAnnotations(core.getAnnotationsList());
  }
};
