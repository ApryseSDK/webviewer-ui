import selectors from 'selectors';

export default store => () => selectors.getZoomStepFactors(store.getState());