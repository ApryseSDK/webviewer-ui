import core from 'core';

export default (toolName, property, value) => {
  const tools = [];

  const toolArray = core.getToolsFromAllDocumentViewers(toolName);
  for (const tool of toolArray) {
    if (tool) {
      tools.push(tool);
    }
  }

  tools.forEach((tool) => {
    tool.setStyles({
      [property]: value,
    });
  });
};
