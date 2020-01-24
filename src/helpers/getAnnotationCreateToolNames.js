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

    // TODO: remove this after this PR is in https://github.com/XodoDocs/webviewer/pull/597
    toolNames.push('AnnotationCreateRubberStamp');
  });

  return toolNames;
};
