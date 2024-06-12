import actions from 'actions';
import selectors from 'selectors';
import core from 'core';

export default (dispatch, store) => () => {
  dispatch(actions.enableElements(['thumbnailControl', 'documentControl']));
  const featureFlags = selectors.getFeatureFlags(store.getState());
  const { customizableUI } = featureFlags;

  if (customizableUI) {
    core.setToolMode('AnnotationEdit');
  }
};
