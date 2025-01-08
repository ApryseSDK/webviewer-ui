import selectors from 'selectors';
import core from 'core';
import defaultTool from 'constants/defaultTool';

export default (dispatch, store) => () => {
  const featureFlags = selectors.getFeatureFlags(store.getState());
  const { customizableUI } = featureFlags;

  if (customizableUI) {
    core.setToolMode(defaultTool);
  }
};
