import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

export default dispatch => signatureAnnotation => {
  core.setToolMode(defaultTool);
  core.getTool('AnnotationCreateSignature').hidePreview();
  core.selectAnnotation(signatureAnnotation);
  dispatch(actions.closeElement('toolsOverlay'));
  dispatch(actions.setActiveToolGroup(''));
};
