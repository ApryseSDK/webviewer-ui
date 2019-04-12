import actions from 'actions';

export default store => dataElement => {
  store.dispatch(actions.closeElement(dataElement));
};