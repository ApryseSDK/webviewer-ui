/**
 * Sets tool mode.
 * @method UI.setToolMode
 * @param {string|Core.Tools.ToolNames} toolName Name of the tool, either from <a href='https://docs.apryse.com/documentation/web/guides/annotations-and-tools/#list-of-tool-names' target='_blank'>tool names list</a> or the name you registered your custom tool with.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setToolMode('AnnotationEdit');
  });
 */

import core from 'core';

export default (toolName) => {
  core.setToolMode(toolName);
};