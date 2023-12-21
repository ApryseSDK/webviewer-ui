
import core from 'core';

const Tools = window.Core.Tools;

export const hasFillColorAndCollapsablePanelSections = (toolName) => {
  const toolsWithCollapsedStylePanels = [
    Tools.RectangleCreateTool,
    Tools.EllipseCreateTool,
    Tools.PolygonCreateTool,
    Tools.PolygonCloudCreateTool,
    Tools.EllipseMeasurementCreateTool,
    Tools.AreaMeasurementCreateTool,
    Tools.FreeTextCreateTool,
    Tools.CalloutCreateTool,
  ];

  return toolsWithCollapsedStylePanels.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideStrokeSlider = (toolName) => {
  const toolsWithHiddenStrokeSlider = [
    Tools.TextUnderlineCreateTool,
    Tools.TextHighlightCreateTool,
    Tools.TextSquigglyCreateTool,
    Tools.TextStrikeoutCreateTool,
    Tools.CountMeasurementCreateTool,
    Tools.RubberStampCreateTool,
  ];
  return toolsWithHiddenStrokeSlider.some((tool) => core.getTool(toolName) instanceof tool);
};

export const hasSnapModeCheckbox = (toolName) => {
  const toolsWithSnapModeCheckbox = [
    Tools.DistanceMeasurementCreateTool,
    Tools.ArcMeasurementCreateTool,
    Tools.PerimeterMeasurementCreateTool,
    Tools.AreaMeasurementCreateTool,
    Tools.RectangularAreaMeasurementCreateTool,
    Tools.CloudyRectangularAreaMeasurementCreateTool,
  ];
  return toolsWithSnapModeCheckbox.some((tool) => core.getTool(toolName) instanceof tool);
};