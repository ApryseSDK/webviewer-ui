import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';

export default dispatch => (e, newTool, oldTool) => {
  if (oldTool && oldTool.name === 'TextSelect') {
    core.clearSelection();
    dispatch(actions.closeElement('textPopup'));
  }

  if (newTool && newTool.name === defaultTool) {
    dispatch(actions.setActiveToolGroup(''));
    dispatch(actions.closeElement('toolsOverlay'));
  }

  if (newTool && newTool.name === 'MarqueeZoomTool') {
    dispatch(actions.closeElement('zoomOverlay'));
  }

  dispatch(actions.setActiveToolNameAndStyle(newTool));
  $(document).trigger('toolModeChanged', [newTool, oldTool]);
};