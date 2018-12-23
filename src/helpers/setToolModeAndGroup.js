import actions from 'actions';
import core from 'core';
import toolStyleExists from 'helpers/toolStyleExists';

export default (dispatch, toolName, toolGroup) =>  {
  if (core.getIsReadOnly() || core.getTool(toolName).disabled) { // TODO: revisit
    console.warn(`${toolName} has been disabled.`);
    return;
  }

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
  
  if (window.innerWidth <= 900 && toolName !== 'Pan' && toolName !== 'AnnotationEdit') { // TODO: revisit
    dispatch(actions.setActiveHeaderGroup('tools'));
  }

  dispatch(actions.closeElement('toolStylePopup'));
  core.setToolMode(toolName);
  dispatch(actions.setActiveToolGroup(toolGroup));
};
