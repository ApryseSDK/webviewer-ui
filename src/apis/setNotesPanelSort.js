import sortMap from 'constants/sortMap';
import actions from 'actions';

export default store => newSort => {
  const { name, getSortedNotes, shouldRenderSeparator, getSeparatorContent } = newSort;

  sortMap[name] = {
    getSortedNotes,
    shouldRenderSeparator,
    getSeparatorContent
  };
  store.dispatch(actions.setSortNotesBy(name));
};
