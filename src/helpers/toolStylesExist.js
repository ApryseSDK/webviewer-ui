import core from 'core';

export default toolName => {
  // we don't want to show the style popup for this tool
  // TODO: there might be a better way to handle this. We can potentially have an API for hiding style popup for certain tools
  if (toolName === 'CropPage' || toolName === 'AnnotationCreateRubberStamp') {
    return false;
  }

  const tool = core.getTool(toolName);
  let hasStyles;

  if (tool?.defaults) {
    hasStyles = Object.keys(tool.defaults).length > 0;
  } else {
    hasStyles = false;
  }

  return hasStyles;
};
