import core from 'core';

/**
 * Set the tool that a user will be using
 * @param {string} toolName Name of the tool, either from <a href='https://docs.apryse.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @fires toolModeUpdated on DocumentViewer
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#event:toolModeUpdated__anchor
 */
export default (toolName) => {
  // Scoped to the current instance: in MultiViewer mode this is both panes, otherwise the primary.
  core.getDocumentViewers().forEach((docViewer) => docViewer.setToolMode(docViewer.getTool(toolName)));
};

