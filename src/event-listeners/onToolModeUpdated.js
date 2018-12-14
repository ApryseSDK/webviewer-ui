import actions from 'actions';

export default dispatch => (e, newTool, oldTool) => {
  dispatch(actions.setActiveToolNameAndStyle(newTool));
  $(document).trigger('toolModeChanged', [newTool, oldTool]);
};