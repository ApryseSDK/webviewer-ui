import core from 'core';
import { isMeasurementTool, getToolNamesByTheSamePreset } from './getMeasurementTools';

export default (toolName, property, value) => {
  let tools = [];

  const toolArray = core.getToolsFromAllDocumentViewers(toolName);
  // currently we want to keep the styles of measurement tools syncs
  // Don't want to keep color or opacity in sync.
  if (isMeasurementTool(toolArray[0]) && !(property === 'StrokeColor' || property === 'Opacity')) {
    const toolNames = getToolNamesByTheSamePreset(toolName);
    tools = Array.prototype.concat.apply([], toolNames.map(core.getToolsFromAllDocumentViewers));
  } else {
    for (const tool of toolArray) {
      if (tool) {
        tools.push(tool);
      }
    }
  }

  tools.forEach((tool) => {
    tool.setStyles({
      [property]: value,
    });
  });
};
