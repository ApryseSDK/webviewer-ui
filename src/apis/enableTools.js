/**
 * Enable multiple tools.
 * @method WebViewer#enableTools
 * @param {Array.<string>} [toolNames=all tools] Array of name of the tools, either from tool names list or the name you registered your custom tool with. If nothing is passed, all tools will be enabled.
 * @example // enable sticky annotation tool and free text tool
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.enableTools([ 'AnnotationCreateSticky', 'AnnotationCreateFreeText' ]);
});
 */

import core from 'core';
import { PRIORITY_ONE } from 'constants/actionPriority';
import { getAnnotationCreateToolNames } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';


export default store => (toolNames = getAnnotationCreateToolNames()) => {
  const toolNameArray = typeof toolNames === 'string' ? [ toolNames ] : toolNames;
  const dataElements = selectors.getToolButtonDataElements(store.getState(), toolNameArray);

  toolNameArray.forEach(toolName => {
    core.getTool(toolName).disabled = false;
  });
  store.dispatch(actions.enableElements(dataElements, PRIORITY_ONE));
};
