/**
 * Sets a header group to be rendered in the Header element. This API comes useful when replacing the entire header items in small screens.
 * @method WebViewerInstance#setActiveHeaderGroup
 * @param {string} headerGroup Name of the header group to be rendered. Default WebViewer UI has eight header groups: 'default', 'small-mobile-more-buttons', 'toolbarGroup-View', 'toolbarGroup-Annotate', 'toolbarGroup-Shapes', 'toolbarGroup-Insert', 'toolbarGroup-Measure', and 'toolbarGroup-Edit'.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.setActiveHeaderGroup('toolbarGroup-Annotate'); // switch to 'Annotate' group header
  });
 */

import actions from 'actions';

export default store => headerGroup => {
  store.dispatch(actions.setActiveHeaderGroup(headerGroup));
};