import core from 'core';

export default toolName => {
  const tool = core.getTool(toolName);
  const ToolNames = window.Core.Tools.ToolNames;

  if (tool?.name === ToolNames.REDACTION) {
    // don't want sliders to show up for redaction tool
    tool.defaults = {
      ...tool.defaults,
      StrokeThickness: null,
      Opacity: null,
      FontSize: null,
    };
  }

  const isHighlightTool =
    tool?.name === ToolNames.HIGHLIGHT ||
    tool?.name === ToolNames.HIGHLIGHT2 ||
    tool?.name === ToolNames.HIGHLIGHT3 ||
    tool?.name === ToolNames.HIGHLIGHT4;

  if (isHighlightTool && !core.isBlendModeSupported('multiply')) {
    tool.defaults.Opacity = null;
  }

  return tool?.defaults;
};
