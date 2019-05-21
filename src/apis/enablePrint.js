/**
 * Enables print feature, affecting the Print button in menu overlay and shortcut to print (ctrl/cmd + p).
 * @method WebViewer#enablePrint
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.enablePrint();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enablePrint();
});
 */

import disablePrint from './disablePrint';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => (enable = true) => {
  const elements = [
    'printButton',
    'printModal'
  ];

  if (enable) {
    store.dispatch(actions.enableElements(elements, PRIORITY_ONE));
  } else {
  console.warn('enablePrint(false) is deprecated, please use disablePrint() instead');
    disablePrint(store)();
  }
};
