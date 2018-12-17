import sortStrategies from 'constants/sortStrategies';
import actions from 'actions';

export default store => newSort => {
  const { name, getSortedNotes, shouldRenderSeparator, getSeparatorContent } = newSort;

  sortStrategies[name] = {
    getSortedNotes,
    shouldRenderSeparator,
    getSeparatorContent
  };
  store.dispatch(actions.setSortStrategy(name));
};
