import core from 'core';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';
import ANNOTATION_CREATE_TOOL_NAMES from 'constants/annotationCreateToolNames';

export default store => () => {
  const elements = [
    'notesPanel',
    'notesPanelButton',
    ...getAnnotationRelatedElements(store.getState())
  ];

  ANNOTATION_CREATE_TOOL_NAMES.forEach(toolName => {
    core.getTool(toolName).disabled = true;
  });
  store.dispatch(actions.disableElements(elements, PRIORITY_ONE));
  core.hideAnnotations(core.getAnnotationsList());
};
