import actions from 'actions';

export default dispatch => (e, tool) => {
  console.log(tool);
  dispatch(actions.setActiveToolStyles(tool.defaults || {}));
};