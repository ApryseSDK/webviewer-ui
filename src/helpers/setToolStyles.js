import core from 'core';
import { isMeasurementTool, getToolNamesByTheSamePreset } from './getMeasurementTools';

export default (toolName, property, value) => {
  let tools = [];

  const tool = core.getTool(toolName);
  // currently we want to keep the styles of measurement tools syncs
  // Don't want to keep color or opacity in sync.
  if (isMeasurementTool(tool) && !(property === 'StrokeColor' || property === 'Opacity')) {
    const toolNames = getToolNamesByTheSamePreset(toolName);
    tools = toolNames.map(core.getTool);
  } else {
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
