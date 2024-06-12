import selectors from 'selectors';

export default (store) => () => {
  return selectors.getCurrentPage(store.getState());
};
