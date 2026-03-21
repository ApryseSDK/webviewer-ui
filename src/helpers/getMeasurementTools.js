import core from 'core';

const { MeasurementUnits } = window.Core.Annotations.Annotation;
const isMeasurementTool = (tool) => !!(tool && tool.Measure);

const imperialConverter = {
  'ft': MeasurementUnits.PRIME_FT,
  'in': MeasurementUnits.DOUBLE_PRIME_IN,
};

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

export { isMeasurementTool, imperialConverter, MeasurementUnits };
