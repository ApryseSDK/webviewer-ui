import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

const { ToolNames } = window.Core.Tools;

export default dispatch => crossStampAnnotation => {
  core.setToolMode(defaultTool);
  core.getTool(ToolNames.FORM_FILL_CROSS).hidePreview();
  dispatch(actions.setActiveToolGroup(''));
  core.selectAnnotation(crossStampAnnotation);
};