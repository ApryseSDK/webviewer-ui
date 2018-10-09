import selectors from 'selectors';

export default store => () => selectors.getCurrentPage(store.getState());

