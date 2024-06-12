import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';

export default (dispatch) => (annotation) => {
  core.setToolMode(defaultTool);
  dispatch(actions.setActiveToolGroup(''));
  core.selectAnnotation(annotation);
};