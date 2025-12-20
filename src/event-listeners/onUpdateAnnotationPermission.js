import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import enableTools from 'src/apis/enableTools';
import disableTools from 'src/apis/disableTools';
import disableFeatures from 'src/apis/disableFeatures';
import enableFeatures from 'src/apis/enableFeatures';
import Feature from 'constants/feature';
import { isOfficeEditorMode } from 'src/helpers/officeEditor';
import selectors from 'selectors';
import getAnnotationCreateToolNames from 'helpers/getAnnotationCreateToolNames';

const getEnabledTools = (state) => {
  const allToolNames = getAnnotationCreateToolNames();
  return allToolNames.filter((toolName) => !selectors.isToolDisabled(state, toolName));
};

export default (store) => () => {
  const { dispatch } = store;
  const isReadOnly = core.getIsReadOnly();
  const isViewOnly = selectors.isViewOnly(store.getState());
  const isCustomUI = selectors.getIsCustomUIEnabled(store.getState());

  if (isReadOnly || (isViewOnly && !isCustomUI)) {
    const state = store.getState();
    const enabledTools = getEnabledTools(state);
    const enabledToolsStash = state.viewer.enabledToolsStash;

    if (!enabledToolsStash || enabledToolsStash.length === 0) {
      dispatch(actions.stashEnabledTools(enabledTools));
    }

    disableTools(store)(enabledTools);
    disableFeatures(store)([Feature.Annotating]);
    core.setToolMode(defaultTool);
    dispatch(actions.setActiveToolGroup(''));
    if (isReadOnly) {
      dispatch(actions.setActiveCustomRibbon('toolbarGroup-View'));
    }
  } else {
    const state = store.getState();
    const enabledToolsStash = state.viewer.enabledToolsStash;

    enableTools(store)(enabledToolsStash);

    // clear the stash after re-enabling tools
    dispatch(actions.stashEnabledTools([]));

    if (!isOfficeEditorMode()) {
      enableFeatures(store)([Feature.Annotating]);
    }
  }

  dispatch(actions.setReadOnly(isReadOnly));
  dispatch(actions.setViewOnly(isViewOnly));
  dispatch(actions.setAdminUser(core.getIsAdminUser()));
  dispatch(actions.setUserName(core.getCurrentUser()));
  core.drawAnnotationsFromList(core.getSelectedAnnotations());
};