/**
 * Sets a header group to be rendered in the Header element. This API comes useful when replacing the entire header items in small screens.
 * @method CoreControls.ReaderControl#setActiveHeaderGroup
 * @param {string} headerGroup Name of the header group to be rendered. Default WebViewer UI has two header groups: default and tools.
 * @example // switch to tools header
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setActiveHeaderGroup('tools');
});
 */

import actions from 'actions';

export default store => headerGroup => {
  store.dispatch(actions.setActiveHeaderGroup(headerGroup));
};