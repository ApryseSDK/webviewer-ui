import core from 'core';

export default toolName => {
  const tool = core.getTool(toolName);
  if (tool && toolName !== 'CropPage') {
    return !!tool.defaults;
  } else {
    return false;
  }
};