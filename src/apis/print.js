/**
 * Print the current document.
 * @method WebViewer#print
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.print();
 */

import print from 'helpers/print';
import selectors from 'selectors';

export default store => () => {
  print(store.dispatch, selectors.isEmbedPrintSupported(store.getState()));  
};
