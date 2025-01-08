import actions from 'actions';
import core from 'core';

export default (dispatch, store) => () => {
  dispatch(actions.openElement('loadingModal'));

  const state = store.getState();
  const { isContentEditingEnabled, isMultiViewerMode } = state.viewer;
  // Ending content edit mode if enabled
  const contentEditManager = core.getContentEditManager();
  if (isContentEditingEnabled) {
    dispatch(actions.setIsContentEditingEnabled(false));
    contentEditManager.endContentEditMode();
  }
  // Ending form field creation mode if enabled
  const formFieldManager = core.getFormFieldCreationManager();
  formFieldManager.endFormFieldCreationMode();

  // Ending multi-viewer mode if enabled
  if (isMultiViewerMode) {
    dispatch(actions.setIsMultiViewerMode(false));
  }
};