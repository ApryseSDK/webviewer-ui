/**
 * Set the tool that a user will be using
 * @param {string} toolName Name of the tool, either from <a href='https://www.pdftron.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @fires toolModeUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:toolModeUpdated__anchor
 */
export default toolName => {
  const tool = window.docViewer.getTool(toolName);

  // If this tool is disabled by calling readerControl.disableTool(s)
  if (tool && tool.disabled) {
    console.warn(`${toolName} has been disabled.`);
    return;
  }
  
  window.docViewer.setToolMode(tool);
};
