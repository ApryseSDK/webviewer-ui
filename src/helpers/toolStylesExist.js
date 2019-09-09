import core from 'core';

export default toolName => {
  const tool = core.getTool(toolName);

  // TODO: better delete all the defaults of the CropPage tool in WebViewer
  if (tool && toolName !== 'CropPage') {
    return !!tool.defaults;
  }

  return false;
};
