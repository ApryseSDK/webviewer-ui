import selectors from 'selectors';

export default store => () => !!selectors.isElementOpen(store.getState(), 'leftPanel');
