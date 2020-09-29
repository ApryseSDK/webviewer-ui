import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import fireEvent from 'helpers/fireEvent';

export default dispatch => (newTool, oldTool) => {
  let shouldCloseToolsOverlay = true;
  if (oldTool && oldTool.name === 'TextSelect') {
    core.clearSelection();
    dispatch(actions.closeElement('textPopup'));
    shouldCloseToolsOverlay = false;
  }

  if (newTool && newTool.name === defaultTool && shouldCloseToolsOverlay) {
    dispatch(actions.setActiveToolGroup(''));
    dispatch(actions.closeElement('toolsOverlay'));
  }

  dispatch(actions.setActiveToolNameAndStyle(newTool));

  fireEvent('toolModeChanged', [newTool, oldTool]);
};