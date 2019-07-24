import core from 'core';

const MEASUREMENT_TOOL_NAMES = [
  'AnnotationCreateDistanceMeasurement',
  'AnnotationCreatePerimeterMeasurement',
  'AnnotationCreateAreaMeasurement',
];

export default (toolName, property, value) => {
  let tools = [];

  if (MEASUREMENT_TOOL_NAMES.includes(toolName)) {
    // currently we want to keep the styles of measurement tools sync
    tools = MEASUREMENT_TOOL_NAMES.map(core.getTool);
  } else {
    const tool = core.getTool(toolName);
    if (tool) {
      tools.push(tool);
    }
  }

  tools.forEach(tool => {
    tool.setStyles(oldStyle => ({
      ...oldStyle,
      [property]: value,
    }));
  });
};
