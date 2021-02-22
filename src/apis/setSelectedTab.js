// TODO: add documentation

import actions from 'actions';

export default store => (id, dataElement) => {
  store.dispatch(actions.setSelectedTab(id, dataElement));
};
