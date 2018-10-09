import selectors from 'selectors';

export default store => () => selectors.getDisplayMode(store.getState());
