import hotkeys from 'src/apis/hotkeys';
import core from 'core';
import { PRIORITY_TWO } from 'constants/actionPriority';
import getAnnotationCreateToolNames from 'helpers/getAnnotationCreateToolNames';
import actions from 'actions';
import selectors from 'selectors';

// a higher order function that creates the enableTools and disableTools APIs
export default (enable, store) => (
  toolNames,
) => {
  const map = {
    AnnotationCreateTextUnderline: 'textUnderlineToolButton',
    AnnotationCreateTextHighlight: 'textHighlightToolButton',
    AnnotationCreateTextSquiggly: 'textSquigglyToolButton',
    AnnotationCreateTextStrikeout: 'textStrikeoutToolButton',
  };

  let emptyArgument = false;

  if (toolNames === undefined) {
    toolNames = getAnnotationCreateToolNames();
    emptyArgument = true;
  }

  const toolNameArray = typeof toolNames === 'string' ? [toolNames] : toolNames;
  const dataElements = selectors.getToolButtonDataElements(
    store.getState(),
    toolNameArray,
  );

  // if the argument is empty, disable the forms group to prevent the user from re-enabling all tools
  if (emptyArgument) {
    dataElements.push('toolbarGroup-Forms');
  }

  // for the tool names in the map, enable/disable other related buttons
  Object.keys(map).forEach((toolName) => {
    if (toolNameArray.indexOf(toolName) !== -1) {
      dataElements.push(map[toolName]);
    }
  });

  const currTool = core.getToolMode();
  if (!enable && toolNames.indexOf(currTool?.name) > -1) {
    core.setToolMode(window.Core.Tools.ToolNames.EDIT);
  }

  if (enable) {
    toolNameArray.forEach((toolName) => {
      toolName && hotkeys.on(toolName);
    });

    store.dispatch(actions.enableElements(dataElements, PRIORITY_TWO));
  } else {
    toolNameArray.forEach((toolName) => {
      toolName && hotkeys.off(toolName);
    });

    store.dispatch(actions.disableElements(dataElements, PRIORITY_TWO));
  }
};
