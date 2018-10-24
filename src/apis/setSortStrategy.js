import sortStrategy from 'constants/sortStrategy';
import actions from 'actions';

export default store => newSort => {
  const { name, getSortedNotes, shouldRenderSeparator, getSeparatorContent } = newSort;

  sortStrategy[name] = {
    getSortedNotes,
    shouldRenderSeparator,
    getSeparatorContent
  };
  store.dispatch(actions.setSortNotesBy(name));
};
