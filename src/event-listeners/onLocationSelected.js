import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

export default dispatch => () => {
  const signatureTool = core.getTool('AnnotationCreateSignature');

  if (signatureTool.getSignaturePaths().length) {
    signatureTool.addSignature();
    // TODO: separate this into annotationAdded event
    core.setToolMode(defaultTool);
    dispatch(actions.closeElement('cursorOverlay'));
  }
};
