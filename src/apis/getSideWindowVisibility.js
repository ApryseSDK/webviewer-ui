import selectors from 'selectors';

export default (store) => () => {
  return !!selectors.isElementOpen(store.getState(), 'leftPanel');
};
