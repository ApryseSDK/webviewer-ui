import core from 'core';

export default () => {
  const toolNames = [];
  const toolModeMap = core.getToolModeMap();

  Object.keys(toolModeMap).forEach(toolMode => {
    const tool = toolModeMap[toolMode];
    const isAnnotationTool = tool instanceof window.Tools.GenericAnnotationCreateTool || tool instanceof window.Tools.TextAnnotationCreateTool || tool.defaults;

    if (isAnnotationTool) {
      toolNames.push(tool.name);
    }
  });

  return toolNames;
};
