import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

export default dispatch => signatureAnnotation => {
  core.setToolMode(defaultTool);
  core.getTool('AnnotationCreateSignature').hidePreview();
  dispatch(actions.closeElement('cursorOverlay'));
  setTimeout(() => {
    core.selectAnnotation(signatureAnnotation);
  }, 0);
};
