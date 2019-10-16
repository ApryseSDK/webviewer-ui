import actions from 'actions';

export default store => bookmarks => {
  store.dispatch(actions.setBookmarks(bookmarks));
};
