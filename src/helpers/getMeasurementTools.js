import core from 'core';
const isMeasurementTool = tool => !!(tool && tool.Measure);

export default () => {
  const tools = [];
  const toolModeMap = core.getToolModeMap();
  Object.values(toolModeMap).forEach(tool => {
    if (isMeasurementTool(tool)) {
      tools.push(tool);
    }
  });
  return tools;
};

export { isMeasurementTool };