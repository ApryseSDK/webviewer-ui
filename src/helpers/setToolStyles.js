import core from 'core';

const { ToolNames } = window.Tools;

export const MEASUREMENT_TOOL_NAMES = [
  ToolNames.DISTANCE_MEASUREMENT,
  ToolNames.DISTANCE_MEASUREMENT2,
  ToolNames.DISTANCE_MEASUREMENT3,
  ToolNames.DISTANCE_MEASUREMENT4,
  ToolNames.PERIMETER_MEASUREMENT,
  ToolNames.PERIMETER_MEASUREMENT2,
  ToolNames.PERIMETER_MEASUREMENT3,
  ToolNames.PERIMETER_MEASUREMENT4,
  ToolNames.AREA_MEASUREMENT,
  ToolNames.AREA_MEASUREMENT2,
  ToolNames.AREA_MEASUREMENT3,
  ToolNames.AREA_MEASUREMENT4,
  ToolNames.RECTANGULAR_AREA_MEASUREMENT,
  ToolNames.RECTANGULAR_AREA_MEASUREMENT2,
  ToolNames.RECTANGULAR_AREA_MEASUREMENT3,
  ToolNames.RECTANGULAR_AREA_MEASUREMENT4,
  ToolNames.ELLIPSE_MEASUREMENT,
  ToolNames.ELLIPSE_MEASUREMENT2,
  ToolNames.ELLIPSE_MEASUREMENT3,
  ToolNames.ELLIPSE_MEASUREMENT4,
];

export default (toolName, property, value) => {
  let tools = [];

  // Don't want to keep color or opacity in sync.
  if (MEASUREMENT_TOOL_NAMES.includes(toolName) && !(property === 'StrokeColor' || property === 'Opacity')) {
    // currently we want to keep the styles of measurement tools sync
    tools = MEASUREMENT_TOOL_NAMES.map(core.getTool);

  } else {
    const tool = core.getTool(toolName);
    if (tool) {
      tools.push(tool);
    }
  }

  tools.forEach(tool => {
    tool.setStyles({
      [property]: value,
    });
  });
};
