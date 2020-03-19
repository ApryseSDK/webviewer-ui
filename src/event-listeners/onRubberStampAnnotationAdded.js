import core from 'core';
import defaultTool from 'constants/defaultTool';

export default () => rubberStampAnnotation => {
  // core.setToolMode(defaultTool);
  core.getTool('AnnotationCreateRubberStamp').hidePreview();
  core.selectAnnotation(rubberStampAnnotation);
};