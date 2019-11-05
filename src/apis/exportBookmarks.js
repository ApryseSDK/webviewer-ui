import selectors from 'selectors';

export default store => () => {
  return selectors.exportBookmarks(store.getState());
};
