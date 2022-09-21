import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';

export default (dispatch, documentViewerKey) => (stampAnnotation) => {
  core.setToolMode(defaultTool);
  dispatch(actions.setActiveToolGroup(''));
  core.selectAnnotation(stampAnnotation, documentViewerKey);
};
