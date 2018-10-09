import exposedSelectors from 'selectors';

export default store => mapExposedSelectors(store);

const mapExposedSelectors = store => Object.keys(exposedSelectors).reduce((acc, selector) => {
  acc[selector] = (...params) => {
    const state = store.getState();
    return exposedSelectors[selector](state, ...params);
  };
  return acc;
}, {});
