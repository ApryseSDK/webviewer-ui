import core from 'core';
import disableAnnotations from './disableAnnotations';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import { PRIORITY_ONE } from 'constants/actionPriority';
import { getAnnotationCreateToolNames } from 'constants/map';
import actions from 'actions';

export default store => (enable = true) =>  {
  let elements = [
    'notesPanel',
    'notesPanelButton',
    ...getAnnotationRelatedElements(store.getState())
  ];

  if (enable) {
    if (!core.isCreateRedactionEnabled()) {
      elements = elements.filter(ele => ele !== 'redactionButton');
    }
    getAnnotationCreateToolNames().forEach(toolName => {
      core.getTool(toolName).disabled = false;
    });

    store.dispatch(actions.enableElements(elements, PRIORITY_ONE));
    core.showAnnotations(core.getAnnotationsList());
  } else {
    console.warn('enableAnnotations(false) is deprecated, please use disableAnnotations() instead');
    disableAnnotations(store)();
  }
};
