/**
 * Sets the print quality. Higher values are higher quality but takes longer to complete and use more memory. The viewer's default quality is 1.
 * @method CoreControls.ReaderControl#setPrintQuality
 * @param {number} quality The quality of the document to print
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setPrintQuality(2);
});
 */

import actions from 'actions';

export default store => quality => {
  store.dispatch(actions.setPrintQuality(quality));
};
