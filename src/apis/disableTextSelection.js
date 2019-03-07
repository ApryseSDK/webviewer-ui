import core from 'core';
import { PRIORITY_ONE } from 'constants/actionPriority';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

export default store => () => {
  core.clearSelection();
  core.setToolMode(defaultTool);
  store.dispatch(actions.closeElement('textPopup'));
  store.dispatch(actions.disableElements(['textPopup', 'textSelectButton'], PRIORITY_ONE));

  window.Tools.Tool.ENABLE_TEXT_SELECTION = false;
};