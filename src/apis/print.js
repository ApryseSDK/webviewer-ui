/**
 * Print the current document.
 * @method WebViewer#print
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.print();
});
 */

import print from 'helpers/print';
import selectors from 'selectors';

export default store => () => {
  print(store.dispatch, selectors.isEmbedPrintSupported(store.getState()));  
};
