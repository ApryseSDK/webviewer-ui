import { addSortStrategy } from 'constants/sortStrategies';
import actions from 'actions';

export default store => newStrategy => {
  if (newStrategy.name) {
    addSortStrategy(newStrategy);
    store.dispatch(actions.setSortStrategy(newStrategy.name));
  } else {
    console.warn('The argument for addSortStrategy must have a "name" property, see https://www.pdftron.com/documentation/web/guides/ui/apis#addsortstrategy');
  }
};
