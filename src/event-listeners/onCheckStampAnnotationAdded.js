import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

const { ToolNames } = window.Core.Tools;

export default (dispatch, documentViewerKey) => (checkStampAnnotation) => {
  core.setToolMode(defaultTool);
  core.getToolsFromAllDocumentViewers(ToolNames.FORM_FILL_CHECKMARK).forEach((tool) => tool.hidePreview());
  dispatch(actions.setActiveToolGroup(''));
  core.selectAnnotation(checkStampAnnotation, documentViewerKey);
};
