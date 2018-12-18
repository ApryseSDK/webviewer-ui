import core from 'core';
import defaultTool from 'constants/defaultTool';

export default () => () => {
  core.setToolMode(defaultTool);
};