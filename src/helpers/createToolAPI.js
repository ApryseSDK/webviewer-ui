import hotkeys from 'src/apis/hotkeys';
import { PRIORITY_ONE } from 'constants/actionPriority';
import getAnnotationCreateToolNames from 'helpers/getAnnotationCreateToolNames';
import actions from 'actions';
import selectors from 'selectors';

// a higher older function that creates the enableTools and disableTools APIs
export default (enable, store) => (
  toolNames = getAnnotationCreateToolNames(),
) => {
  const map = {
    AnnotationCreateTextUnderline: 'textUnderlineToolButton',
    AnnotationCreateTextHighlight: 'textHighlightToolButton',
    AnnotationCreateTextSquiggly: 'textSquigglyToolButton',
    AnnotationCreateTextStrikeout: 'textStrikeoutToolButton',
  };

  const toolNameArray = typeof toolNames === 'string' ? [toolNames] : toolNames;
  const dataElements = selectors.getToolButtonDataElements(
    store.getState(),
    toolNameArray,
  );

  // for the tool names in the map, enable/disable other related buttons
  Object.keys(map).forEach(toolName => {
    if (toolNameArray.includes(toolName)) {
      dataElements.push(map[toolName]);
    }
  });

  if (enable) {
    toolNameArray.forEach(toolName => {
      hotkeys.on(toolName);
    });

    store.dispatch(actions.enableElements(dataElements, PRIORITY_ONE));
  } else {
    toolNameArray.forEach(toolName => {
      hotkeys.off(toolName);
    });

    store.dispatch(actions.disableElements(dataElements, PRIORITY_ONE));
  }
};
