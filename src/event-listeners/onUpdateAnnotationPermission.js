import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import { PRIORITY_ONE } from 'constants/actionPriority';
import enableTools from 'src/apis/enableTools';
import disableTools from 'src/apis/disableTools';

export default store => () => {
  const { dispatch } = store;
  const isReadOnly = core.getIsReadOnly();
  const elements = [
    'annotationPopup',
    'toolsButton',
    'linkButton',
  ];

  if (isReadOnly) {
    disableTools(store)();
    dispatch(actions.disableElements(elements, PRIORITY_ONE));
    core.setToolMode(defaultTool);
  } else {
    enableTools(store)();
    dispatch(actions.enableElements(elements, PRIORITY_ONE));
  }

  dispatch(actions.setReadOnly(core.getIsReadOnly()));
  dispatch(actions.setAdminUser(core.getIsAdminUser()));
  dispatch(actions.setUserName(core.getCurrentUser()));
  core.drawAnnotationsFromList(core.getSelectedAnnotations());
};