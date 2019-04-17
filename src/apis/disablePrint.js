/**
 * Disables print feature, affecting the Print button in menu overlay and shortcut to print (ctrl/cmd + p).
 * @method WebViewer#disablePrint
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.disablePrint();
 */

import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  const elements = [
    'printButton',
    'printModal'
  ];

  store.dispatch(actions.disableElements(elements, PRIORITY_ONE));
};
