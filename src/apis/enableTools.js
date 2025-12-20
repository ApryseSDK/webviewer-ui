/**
 * Enables multiple tools in the UI
 * @method UI.enableTools
 * @memberof UI
 * @param {Array.<string|Core.Tools.ToolNames>} [toolNames] Array of tool names, either from {@link Core.Tools.ToolNames} or the name you registered your custom tool with. If nothing is passed, all tools will be enabled.
 * @see UI.disableTools
 * @see Core.Tools.ToolNames
 * @example
WebViewer(...)
  .then(function(instance) {
    // Enable sticky annotation tool and free text tool
    instance.UI.enableTools(['AnnotationCreateSticky', instance.Core.Tools.ToolNames.FREETEXT]);
  });
 */

import createToolAPI from 'helpers/createToolAPI';

const enable = true;
export default (store) => createToolAPI(enable, store);
