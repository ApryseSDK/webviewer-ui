import selectors from 'selectors';

export default store => () => selectors.getZoom(store.getState());

