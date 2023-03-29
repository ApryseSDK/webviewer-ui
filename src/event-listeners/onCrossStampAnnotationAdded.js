import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

const { ToolNames } = window.Core.Tools;

export default (dispatch, documentViewerKey) => (crossStampAnnotation) => {
  core.setToolMode(defaultTool);
  core.getToolsFromAllDocumentViewers(ToolNames.FORM_FILL_CROSS).forEach((tool) => tool.hidePreview());
  dispatch(actions.setActiveToolGroup(''));
  core.selectAnnotation(crossStampAnnotation, documentViewerKey);
};
