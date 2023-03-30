import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

export default (dispatch, store) => (newTool, oldTool) => {
  if (oldTool && oldTool.name === 'TextSelect') {
    core.clearSelection();
    dispatch(actions.closeElement('textPopup'));
  }

  dispatch(actions.setActiveToolNameAndStyle(newTool));

  const state = store.getState();
  const activeToolGroup = selectors.getActiveToolGroup(state);
  const activeToolName = selectors.getActiveToolName(state);
  if (activeToolName === 'AnnotationEdit' && activeToolGroup === 'signatureTools') {
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
    store.dispatch(actions.closeElement('toolsOverlay'));
  } else {
    store.dispatch(actions.setActiveToolGroup(group));
    store.dispatch(actions.openElement('toolsOverlay'));
  }
};