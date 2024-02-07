import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

export default (documentViewerKey, dispatch, store) => (rubberStampAnnotation) => {
  core.setToolMode(defaultTool);
  core.getToolsFromAllDocumentViewers('AnnotationCreateRubberStamp').forEach((tool) => tool.hidePreview());
  core.selectAnnotation(rubberStampAnnotation, documentViewerKey);
  // If we are in the modular UI, we reset the selected stamp index when a stamp is added
  const state = store.getState();
  const isCustomizableUI = state.featureFlags.customizableUI;
  if (isCustomizableUI) {
    dispatch(actions.setSelectedStampIndex(null));
  }
};
