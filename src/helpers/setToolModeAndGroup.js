import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';

export default (store, toolName) => {
  const { dispatch, getState } = store;
  const state = getState();
  const toolGroup =
    selectors.getToolButtonObject(getState(), toolName)?.group || '';

  const isCustomizableUI = state.featureFlags.customizableUI;
  if (isCustomizableUI) {
    const groupedItemsWithTool = selectors.getGroupedItemsWithSelectedTool(state, toolName);
    dispatch(actions.setLastPickedToolAndGroup({ tool: toolName, group: groupedItemsWithTool }));
    dispatch(actions.setLastPickedToolForGroupedItems(groupedItemsWithTool, toolName));
    core.setToolMode(toolName);
    return;
  }

  if (toolGroup) {
    dispatch(actions.openElement(DataElements.TOOLS_OVERLAY));
  } else {
    dispatch(actions.closeElement(DataElements.TOOLS_OVERLAY));
  }

  const hasToolBeenSelected = core.getToolMode().name === toolName;
  if (hasToolBeenSelected && toolStylesExist(toolName)) {
    dispatch(actions.toggleElement(DataElements.TOOL_STYLE_POPUP));
    return;
  }

  dispatch(actions.closeElement(DataElements.TOOL_STYLE_POPUP));
  core.setToolMode(toolName);
  dispatch(actions.setActiveToolGroup(toolGroup));
};
