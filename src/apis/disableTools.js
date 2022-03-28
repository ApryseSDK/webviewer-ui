/**
 * Disable multiple tools. This API uses disableElements internally to remove tool buttons from the DOM, and also disable the corresponding hotkeys.
 * @method UI.disableTools
 * @param {Array.<string>|Array.<Core.Tools.ToolNames>} [toolNames=all tools] Array of name of the tools, either from tool names list or the name you registered your custom tool with. If nothing is passed, all tools will be disabled.
 * @example
WebViewer(...)
  .then(function(instance) {
    const { Tools } = instance.Core;
    // disable sticky annotation tool and free text tool
    instance.UI.disableTools([Tools.ToolNames.STICKY, Tools.ToolNames.FREETEXT]);
  });
 */

import createToolAPI from 'helpers/createToolAPI';

const enable = false;
export default store => createToolAPI(enable, store);
