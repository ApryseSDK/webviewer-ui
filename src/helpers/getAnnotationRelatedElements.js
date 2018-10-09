import core from 'core';

export default state =>  {
  const elements = [
    'textUnderlineToolButton',
    'textHighlightToolButton',
    'textSquigglyToolButton',
    'textStrikeoutToolButton',
    'annotationCommentButton',
    'freeHandToolGroupButton',
    'textToolGroupButton',
    'shapeToolGroupButton',
    'miscToolGroupButton',
    'toolsButton',
  ];
  const toolModeMap = core.getToolModeMap();

  Object.keys(toolModeMap).forEach(toolMode => {
    const tool = toolModeMap[toolMode];
    const isAnnotationTool = tool instanceof window.Tools.GenericAnnotationCreateTool || tool instanceof window.Tools.TextAnnotationCreateTool || tool.defaults;

    if (isAnnotationTool) {
      const element = state.viewer.toolButtonObjects[tool.name].dataElement;
      elements.push(element);
    }
  });

  return elements;
};
