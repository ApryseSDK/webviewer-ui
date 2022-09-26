/**
 * Enable multiple tools.
 * @method UI.enableTools
 * @param {Array.<string>} [toolNames=all tools] Array of name of the tools, either from tool names list or the name you registered your custom tool with. If nothing is passed, all tools will be enabled.
 * @example
WebViewer(...)
  .then(function(instance) {
    // enable sticky annotation tool and free text tool
    instance.UI.enableTools([ 'AnnotationCreateSticky', 'AnnotationCreateFreeText' ]);
  });
 */

import createToolAPI from 'helpers/createToolAPI';

const enable = true;
export default (store) => createToolAPI(enable, store);
