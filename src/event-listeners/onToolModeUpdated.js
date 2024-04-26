import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import defaultTool from 'constants/defaultTool';

export default (dispatch, store) => (newTool, oldTool) => {
  const { ToolNames } = window.Core.Tools;

  if (oldTool && oldTool.name === ToolNames.TEXT_SELECT) {
    core.clearSelection();
    dispatch(actions.closeElement('textPopup'));
  }
  dispatch(actions.setActiveToolNameAndStyle(newTool));

  const state = store.getState();
  const activeToolGroup = selectors.getActiveToolGroup(state);
  const activeToolName = selectors.getActiveToolName(state);
  const selectedStampIndex = selectors.getSelectedStampIndex(state);
  // If we are in the modular UI and switch out of the rubber stamp tool, we need to re-set the active stamp index
  const isCustomizableUI = state.featureFlags.customizableUI;

  if (isCustomizableUI) {
    const activeGroupedItems = state.viewer.activeGroupedItems;
    const isLastPickedGroupUndefined = activeGroupedItems?.every((group) => group === undefined);

    if (oldTool.name === ToolNames.RUBBER_STAMP) {
      dispatch(actions.setLastSelectedStampIndex(selectedStampIndex));
      dispatch(actions.setSelectedStampIndex(null));
    }
    if (oldTool.name === ToolNames.RUBBER_STAMP || oldTool.name === ToolNames.SIGNATURE) {
      if (newTool.name === defaultTool) {
        return;
      }
    }
    if (newTool.name === ToolNames.EDIT || isLastPickedGroupUndefined) {
      return;
    }
    dispatch(actions.setActiveGroupedItemWithTool(newTool.name));
  }

  if (activeToolName === ToolNames.EDIT && (activeToolGroup === 'signatureTools' || activeToolGroup === 'rubberStampTools')) {
    return;
  }
  const { group = '' } = selectors.getToolButtonObject(state, newTool.name);

  const currentToolbarGroup = selectors.getCurrentToolbarGroup(state);
  // Search the current toolbar group first
  const toolbarGroupNames = selectors.getEnabledToolbarGroups(state).reduce((acc, groupName) => {
    if (groupName !== currentToolbarGroup) {
      acc.push(groupName);
    }
    return acc;
  }, [currentToolbarGroup]);
  // Find the ribbon group this tool falls under and change if necessary
  for (let i = 0; i < toolbarGroupNames.length; i++) {
    const toolbarGroupName = toolbarGroupNames[i];
    const toolbarGroupItems = selectors.getToolbarGroupItems(toolbarGroupName)(state);
    // Looks for the matching toolgroup or tool under this toolbar
    const groupItems = toolbarGroupItems.filter((groupItem) => groupItem.toolGroup === group || groupItem.toolName === newTool.name);
    if (groupItems.length > 0) {
      if (toolbarGroupName !== currentToolbarGroup) {
        dispatch({
          type: 'SET_TOOLBAR_GROUP',
          payload: { toolbarGroup: toolbarGroupName },
        });
      }
      break;
    }
  }

  setActiveToolGroupAndToolsOverlay(store, group);
};

const setActiveToolGroupAndToolsOverlay = (store, group) => {
  if (!group) {
    store.dispatch(actions.setActiveToolGroup(''));
    store.dispatch(actions.closeElement(DataElements.TOOLS_OVERLAY));
  } else {
    store.dispatch(actions.setActiveToolGroup(group));
    store.dispatch(actions.openElement(DataElements.TOOLS_OVERLAY));
  }
};