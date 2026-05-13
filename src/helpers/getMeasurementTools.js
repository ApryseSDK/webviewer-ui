import core from 'core';

const isMeasurementTool = (tool) => !!(tool && tool.Measure);

export default () => {
  const tools = [];
  const documentViewers = core.getDocumentViewers();
  documentViewers.forEach((viewer, index) => {
    const toolModeMap = core.getToolModeMap(index + 1);
    if (toolModeMap) {
      Object.values(toolModeMap).forEach((tool) => {
        if (isMeasurementTool(tool)) {
          tools.push(tool);
        }
      });
    }
  });
  return tools;
};

export { isMeasurementTool };
