import core from 'core';

export default toolName => {
  const tool = core.getTool(toolName);
  const ToolNames = window.Core.Tools.ToolNames;


  const isHighlightTool =
    tool?.name === ToolNames.HIGHLIGHT ||
    tool?.name === ToolNames.HIGHLIGHT2 ||
    tool?.name === ToolNames.HIGHLIGHT3 ||
    tool?.name === ToolNames.HIGHLIGHT4;
  if (isHighlightTool && !core.isBlendModeSupported('multiply')) {
    tool.defaults.Opacity = null;
  }

  // widget don't support opacity
  if (tool?.name.includes(ToolNames.TEXT_FORM_FIELD)) {
    tool.defaults.Opacity = null;
  }

  return tool?.defaults;
};
