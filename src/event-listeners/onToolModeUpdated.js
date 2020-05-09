import core from 'core';
import actions from 'actions';
import fireEvent from 'helpers/fireEvent';

export default dispatch => (newTool, oldTool) => {
  if (oldTool && oldTool.name === 'TextSelect') {
    core.clearSelection();
    dispatch(actions.closeElement('textPopup'));
  }

  dispatch(actions.setActiveToolNameAndStyle(newTool));

  fireEvent('toolModeChanged', [newTool, oldTool]);
};
