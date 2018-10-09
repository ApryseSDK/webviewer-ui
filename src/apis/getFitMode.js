import selectors from 'selectors';

export default store => () => selectors.getFitMode(store.getState());