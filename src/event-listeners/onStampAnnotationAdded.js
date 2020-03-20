import core from 'core';
import defaultTool from 'constants/defaultTool';

export default () => stampAnnotation => {
  core.setToolMode(defaultTool);
  core.selectAnnotation(stampAnnotation);
};