/**
 * Use/not use embedded printing. You may not want to use embedded printing if there are custom annotations in your document.
 * @method WebViewer#useEmbeddedPrint
 * @param {boolean} [use=true] Whether or not to use embedded printing
 * @example // disable embedded printing
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.useEmbeddedPrint(false);
});
 */

import actions from 'actions';

export default store => useEmbeddedPrint => {
  store.dispatch(actions.useEmbeddedPrint(useEmbeddedPrint));
};