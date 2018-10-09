import actions from 'actions';
import core from 'core';
import toolStyleExists from 'helpers/toolStyleExists';

export default (dispatch, toolName, toolGroup) =>  {
  if (toolGroup) {
    dispatch(actions.openElement('toolsOverlay'));
  } else {
    dispatch(actions.closeElement('toolsOverlay'));
  }
  
  const hasToolBeenSelected = core.getToolMode().name === toolName;
  if (hasToolBeenSelected && toolStyleExists(toolName)) {
    dispatch(actions.toggleElement('toolStylePopup'));
    return;
  }
  
  if (window.innerWidth <= 900) {
    dispatch(actions.setActiveHeaderGroup('tools'));
  }

  dispatch(actions.closeElement('toolStylePopup'));
  core.setToolMode(toolName);
  dispatch(actions.setActiveToolGroup(toolGroup));
};
