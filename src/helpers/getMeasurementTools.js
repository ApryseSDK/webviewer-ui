import core from 'core';

const { ToolNames } = window.Tools;
const { MeasurementUnits } = window.Annotations.Annotation;
const isMeasurementTool = (tool) => !!(tool && tool.Measure);

const MEASUREMENT_TOOL_NAMES = [
  ToolNames.ARC_MEASUREMENT,
  ToolNames.ARC_MEASUREMENT2,
  ToolNames.ARC_MEASUREMENT3,
  ToolNames.ARC_MEASUREMENT4,
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
  ToolNames.CLOUDY_RECTANGULAR_AREA_MEASUREMENT,
  ToolNames.CLOUDY_RECTANGULAR_AREA_MEASUREMENT2,
  ToolNames.CLOUDY_RECTANGULAR_AREA_MEASUREMENT3,
  ToolNames.CLOUDY_RECTANGULAR_AREA_MEASUREMENT4,
  ToolNames.ELLIPSE_MEASUREMENT,
  ToolNames.ELLIPSE_MEASUREMENT2,
  ToolNames.ELLIPSE_MEASUREMENT3,
  ToolNames.ELLIPSE_MEASUREMENT4,
];

const imperialConverter = {
  'ft': MeasurementUnits.PRIME_FT,
  'in': MeasurementUnits.DOUBLE_PRIME_IN,
};

const getToolNamesByTheSamePreset = (toolName) => MEASUREMENT_TOOL_NAMES.filter((name) => {
  if (isNaN(Number(toolName[toolName.length - 1]))) {
    return isNaN(Number(name[name.length - 1]));
  }
  return toolName[toolName.length - 1] === name[name.length - 1];
});

export default () => {
  const tools = [];
  const toolModeMap = core.getToolModeMap();
  Object.values(toolModeMap).forEach((tool) => {
    if (isMeasurementTool(tool)) {
      tools.push(tool);
    }
  });
  return tools;
};

export { isMeasurementTool, getToolNamesByTheSamePreset, imperialConverter, MeasurementUnits };
