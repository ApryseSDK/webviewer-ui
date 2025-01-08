import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';

export default (store, toolName) => {
  const { dispatch, getState } = store;
  const state = getState();
  const featureFlags = state.featureFlags;
  const { customizableUI } = featureFlags;

  const toolGroup =
    selectors.getToolButtonObject(state, toolName)?.group || '';

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
  dispatch(actions.setActiveToolGroup(toolGroup));
  if (customizableUI) {
    // We can also set the active ribbon here if the tool is associated with a ribbon
    const ribbonAssociatedWithTool = selectors.getRibbonAssociatedWithTool(state, toolName);
    if (ribbonAssociatedWithTool) {
      store.dispatch(actions.setActiveCustomRibbon(ribbonAssociatedWithTool));
    }
  }
  core.setToolMode(toolName);

};
