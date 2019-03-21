import core from 'core';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';
import selectors from 'selectors';


export default store => (toolNames = selectors.getAnnotationToolNames(store.getState())) => {
  const toolNameArray = typeof toolNames === 'string' ? [ toolNames ] : toolNames;
  const dataElements = selectors.getToolButtonDataElements(store.getState(), toolNameArray);

  toolNameArray.forEach(toolName => {
    core.getTool(toolName).disabled = false;
  });
  store.dispatch(actions.enableElements(dataElements, PRIORITY_ONE));
};
