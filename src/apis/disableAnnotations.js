import core from 'core';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';
import selectors from 'selectors';

export default store => () => {
  const elements = [
    'notesPanel',
    'notesPanelButton',
    ...getAnnotationRelatedElements(store.getState())
  ];

  const annotationToolNames = selectors.getAnnotationToolNames(store.getState());
  annotationToolNames.forEach(toolName => {
    core.getTool(toolName).disabled = true;
  });
  store.dispatch(actions.disableElements(elements, PRIORITY_ONE));
  core.hideAnnotations(core.getAnnotationsList());
};
