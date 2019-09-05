/**
 * Enable multiple tools.
 * @method WebViewer#enableTools
 * @param {Array.<string>} [toolNames=all tools] Array of name of the tools, either from tool names list or the name you registered your custom tool with. If nothing is passed, all tools will be enabled.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    // enable sticky annotation tool and free text tool
    instance.enableTools([ 'AnnotationCreateSticky', 'AnnotationCreateFreeText' ]);
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();

  // enable sticky annotation tool and free text tool
  instance.enableTools([ 'AnnotationCreateSticky', 'AnnotationCreateFreeText' ]);
});
 */

import createToolAPI from 'helpers/createToolAPI';

const enable = true;
export default store => createToolAPI(enable, store);
