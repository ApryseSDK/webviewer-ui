/**
 * Sets page labels that will be displayed in UI. You may want to use this API if the document's page labels start with characters/numbers other than 1.
 * @method CoreControls.ReaderControl#setPageLabels
 * @param {Array.<string>} pageLabels Page labels that will be displayed in UI.
 * @example // assume a document has 5 pages
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setPageLabels(['i', 'ii', 'iii', '4', '5']);
});
 */

import actions from 'actions';

export default store => pageLabels => {
  store.dispatch(actions.setPageLabels(pageLabels));
};