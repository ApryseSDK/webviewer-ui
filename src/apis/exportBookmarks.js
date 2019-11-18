import selectors from 'selectors';

export default store => () => {
  return selectors.getBookmarks(store.getState());
};
