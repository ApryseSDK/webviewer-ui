import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

export default dispatch => rubberStampAnnotation => {
  core.setToolMode(defaultTool);
  core.getTool('AnnotationCreateRubberStamp').hidePreview();
  dispatch(actions.closeElement('cursorOverlay'));
  setTimeout(() => {
    core.selectAnnotation(rubberStampAnnotation);
  }, 0);
};