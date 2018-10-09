import selectors from 'selectors';

export default store => dataElement => selectors.isElementDisabled(store.getState(), dataElement);