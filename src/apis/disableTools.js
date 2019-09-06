/**
 * Disable multiple tools.
 * @method WebViewer#disableTools
 * @param {Array.<string>} [toolNames=all tools] Array of name of the tools, either from tool names list or the name you registered your custom tool with. If nothing is passed, all tools will be disabled.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    // disable sticky annotation tool and free text tool
    instance.disableTools([ 'AnnotationCreateSticky', 'AnnotationCreateFreeText' ]);
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();

  // disable sticky annotation tool and free text tool
  instance.disableTools([ 'AnnotationCreateSticky', 'AnnotationCreateFreeText' ]);
});
 */

import createToolAPI from 'helpers/createToolAPI';

const enable = false;
export default store => createToolAPI(enable, store);
