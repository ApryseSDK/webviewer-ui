/**
 * Sets a panel to be active in the leftPanel element. Note that this API does not include opening the leftPanel.
 * @method WebViewer#setActiveLeftPanel
 * @param {string} dataElement Name of the panel to be active in leftPanel. Default WebViewer UI has three panel options: thumbnailsPanel, outlinesPanel and notesPanel.
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  // open left panel
  instance.openElements([ 'leftPanel' ]);
  // view outlines panel
  instance.setActiveLeftPanel('outlinesPanel');
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();

  // open left panel
  instance.openElements([ 'leftPanel' ]);
  // view outlines panel
  instance.setActiveLeftPanel('outlinesPanel');
});
 */

import actions from 'actions';

export default store => headerGroup => {
  store.dispatch(actions.setActiveLeftPanel(headerGroup));
};