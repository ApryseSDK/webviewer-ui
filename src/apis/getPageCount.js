import selectors from 'selectors';

export default (store) => () => {
  return selectors.getTotalPages(store.getState());
};
