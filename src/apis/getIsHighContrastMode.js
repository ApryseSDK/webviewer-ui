import selectors from 'selectors';

export default store => () => {
  return selectors.getIsHighContrastMode(store.getState());
};
