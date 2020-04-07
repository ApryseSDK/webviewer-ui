import core from 'core';

export default toolName => {
  const tool = core.getTool(toolName);
  if (tool) {
    if (tool.name === 'AnnotationCreateRedaction') {
      // don't want sliders to show up for redaction tool
      tool.defaults = {
        ...tool.defaults,
        StrokeThickness: null,
        Opacity: null,
        FontSize: null,
      };
    }
    return tool.defaults;
  }
};