import actions from 'actions';

export default dispatch => (e, tool) => {
  dispatch(actions.setActiveToolNameAndStyle(tool));
  $(document).trigger('toolModeChanged');
};