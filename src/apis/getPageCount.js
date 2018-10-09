import selectors from 'selectors';

export default store => () => selectors.getTotalPages(store.getState());
