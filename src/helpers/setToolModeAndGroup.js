import core from 'core';
import toolStylesExist from 'helpers/toolStylesExist';
import actions from 'actions';
import selectors from 'selectors';

export default (store, toolName) => {
  const { dispatch, getState } = store;
  const toolGroup =
    selectors.getToolButtonObject(getState(), toolName)?.group || '';

  if (toolGroup) {
    dispatch(actions.openElement('groupOverlay'));
  } else {
    dispatch(actions.closeElement('groupOverlay'));
  }

  const hasToolBeenSelected = core.getToolMode().name === toolName;
  if (hasToolBeenSelected && toolStylesExist(toolName)) {
    dispatch(actions.toggleElement('toolStylePopup'));
    return;
  }

  if (
    window.innerWidth <= 900 &&
    // TODO: revisit
    toolName !== 'Pan' &&
    toolName !== 'AnnotationEdit'
  ) {
    dispatch(actions.setActiveHeaderGroup('tools'));
  }

  dispatch(actions.closeElement('toolStylePopup'));
  core.setToolMode(toolName);
  dispatch(actions.setActiveToolGroup(toolGroup));
};
