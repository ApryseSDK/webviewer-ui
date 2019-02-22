import core from 'core';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';
import selectors from 'selectors';

export default store => toolName => {
  const dataElement = selectors.getToolButtonDataElement(store.getState(), toolName); 

  store.dispatch(actions.disableElement(dataElement, PRIORITY_ONE));
  core.getTool(toolName).disabled = true;
};

