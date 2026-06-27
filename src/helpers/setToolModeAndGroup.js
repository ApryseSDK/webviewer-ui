import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import actions from 'actions';
import selectors from 'selectors';

export default (store, toolName) => {
  const { dispatch, getState } = store;
  const state = getState();
  const featureFlags = state.featureFlags;
  const { customizableUI } = featureFlags;

  const toolGroup =
    selectors.getToolButtonObject(state, toolName)?.group || '';

  const hasToolBeenSelected = core.getToolMode().name === toolName;
  if (hasToolBeenSelected && toolStylesExist(toolName)) {
    return;
  }

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
