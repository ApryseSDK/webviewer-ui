import selectors from 'selectors';

export default store => dataElement => selectors.isElementOpen(store.getState(), dataElement);
