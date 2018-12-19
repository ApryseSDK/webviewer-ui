import core from 'core';
import actions from 'actions';
import getAnnotationRelatedElements from 'helpers/getAnnotationRelatedElements';
import defaultTool from 'constants/defaultTool';
import { PRIORITY_ONE } from 'constants/actionPriority';

export default ({ dispatch, getState }) => () => {
  const isReadOnly = core.getIsReadOnly();
  const elements = [
    'annotationPopup',
    ...getAnnotationRelatedElements(getState()),
  ];

  if (isReadOnly) {
    dispatch(actions.disableElements(elements, PRIORITY_ONE));
    core.setToolMode(defaultTool);
  } else {
    dispatch(actions.enableElements(elements, PRIORITY_ONE));
  }
  
  dispatch(actions.setReadOnly(core.getIsReadOnly()));
  dispatch(actions.setAdminUser(core.getIsAdminUser()));
  dispatch(actions.setUserName(core.getCurrentUser()));
  core.drawAnnotationsFromList(core.getSelectedAnnotations());
};