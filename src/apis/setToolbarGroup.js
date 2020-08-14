import actions from 'actions';

/**
 * Sets the current active toolbar group.
 * @method WebViewerInstance#setToolbarGroup
 * @param {string} groupDataElement The groups dataElement. Default values are: toolbarGroup-View, toolbarGroup-Annotate,
 * toolbarGroup-Shapes, toolbarGroup-Insert, toolbarGroup-Measure, toolbarGroup-Edit
 * @param {boolean} pickTool If true, after setting the toolbar group, the last picked tool for the group will be set as the current tool. Defaults to true.
 * @example
WebViewer(...)
  .then(function(instance) {
    // Change the toolbar group to the `Shapes` group
    instance.setToolbarGroup('toolbarGroup-Shapes');
 */

export default store => (group, pickTool = true) => {
  store.dispatch(actions.setToolbarGroup(group, pickTool));
};