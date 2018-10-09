import actions from 'actions';

export default dispatch => (e, tool) => {
  dispatch(actions.setActiveToolStyles(tool.defaults || {}));
};