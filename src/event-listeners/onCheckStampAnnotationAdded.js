import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

const { ToolNames } = window.Tools;

export default dispatch => checkStampAnnotation => {
  core.setToolMode(defaultTool);
  core.getTool(ToolNames.FORM_FILL_CHECKMARK).hidePreview();
  dispatch(actions.setActiveToolGroup(''));
  core.selectAnnotation(checkStampAnnotation);
};