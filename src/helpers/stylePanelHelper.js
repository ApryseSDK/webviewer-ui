
const ToolNames = window.Core.Tools.ToolNames;

export const hasFillColorAndCollapsablePanelSections = (toolName) => {
  const toolsWithCollapsedStylePanels = [
    ToolNames.RECTANGLE,
    ToolNames.ELLIPSE,
    ToolNames.POLYGON,
    ToolNames.POLYGON_CLOUD,
    ToolNames.ELLIPSE_MEASUREMENT,
    ToolNames.AREA_MEASUREMENT,
    ToolNames.FREETEXT,
    ToolNames.CALLOUT,
    ToolNames.CALENDAR,
  ];

  return toolsWithCollapsedStylePanels.includes(toolName);
};

export const shouldHideStrokeSlider = (toolName) => {
  const toolsWithHiddenStrokeSlider = [
    ToolNames.UNDERLINE,
    ToolNames.HIGHLIGHT,
    ToolNames.SQUIGGLY,
    ToolNames.STRIKEOUT,
    ToolNames.COUNT_MEASUREMENT,
    ToolNames.RUBBER_STAMP
  ];

  return toolsWithHiddenStrokeSlider.includes(toolName);
};
