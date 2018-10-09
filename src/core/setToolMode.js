/**
 * Set the tool that a user will be using
 * @param {string} toolName Tool name of the tool, which is either the key from toolModeMap or the name you registered your custom tool with.
 * @fires toolModeUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/CoreControls.DocumentViewer.html#event:toolModeUpdated__anchor
 */
export default toolName => {
  const tool = window.docViewer.getTool(toolName);

  // If this tool is disabled by calling readerControl.disableTool(s)
  if (tool.disabled) {
    console.warn(`${toolName} has been disabled.`);
    return;
  }
  
  window.docViewer.setToolMode(tool);
};
