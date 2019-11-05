import actions from 'actions';

export default store => bookmarks => {
  store.dispatch(actions.importBookmarks(bookmarks));
};
