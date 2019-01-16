import core from 'core';

export default toolName => {
  const tool = core.getTool(toolName);

  return !!tool.defaults;
};