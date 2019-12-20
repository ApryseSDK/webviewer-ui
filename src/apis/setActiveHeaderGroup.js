/**
 * Sets a header group to be rendered in the Header element. This API comes useful when replacing the entire header items in small screens.
 * @method WebViewerInstance#setActiveHeaderGroup
 * @param {string} headerGroup Name of the header group to be rendered. Default WebViewer UI has two header groups: default and tools.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setActiveHeaderGroup('tools'); // switch to tools header
  });
 */

import actions from 'actions';

export default store => headerGroup => {
  store.dispatch(actions.setActiveHeaderGroup(headerGroup));
};