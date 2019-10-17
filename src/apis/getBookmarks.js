import selectors from 'selectors';

export default store => bookmarks => {
  return selectors.getBookmarks(store.getState());
};
