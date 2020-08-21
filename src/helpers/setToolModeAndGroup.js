import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import actions from 'actions';
import selectors from 'selectors';

export default (store, toolName) => {
  const { dispatch, getState } = store;
  const toolGroup =
    selectors.getToolButtonObject(getState(), toolName)?.group || '';

  if (toolGroup) {
    dispatch(actions.openElement('toolsOverlay'));
  } else {
    dispatch(actions.closeElement('toolsOverlay'));
  }

  const hasToolBeenSelected = core.getToolMode().name === toolName;
  if (hasToolBeenSelected && toolStylesExist(toolName)) {
    dispatch(actions.toggleElement('toolStylePopup'));
    return;
  }

  dispatch(actions.closeElement('toolStylePopup'));
  core.setToolMode(toolName);
  dispatch(actions.setActiveToolGroup(toolGroup));
};
