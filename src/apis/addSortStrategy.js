import { addSortStrategy } from 'constants/sortStrategies';
import actions from 'actions';

export default store => newStrategy => {
  addSortStrategy(newStrategy);
  store.dispatch(actions.setSortStrategy(name));
};
