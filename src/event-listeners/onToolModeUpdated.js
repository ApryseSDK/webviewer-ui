import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';
import fireEvent from 'helpers/fireEvent';

export default dispatch => (newTool, oldTool) => {
  if (oldTool && oldTool.name === 'TextSelect') {
    core.clearSelection();
    dispatch(actions.closeElement('textPopup'));
  }

  if (newTool && newTool.name === defaultTool) {
    dispatch(actions.setActiveToolGroup(''));
    dispatch(actions.closeElement('groupOverlay'));
  }

  dispatch(actions.setActiveToolNameAndStyle(newTool));

  fireEvent('toolModeChanged', [newTool, oldTool]);
};