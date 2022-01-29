/**
 * Contains string enums for all toolbar options for WebViewer.
 * @name UI.ToolbarGroup
 * @property {string} VIEW Sets the current toolbar as the view group.
 * @property {string} ANNOTATE Sets the current toolbar as the annotate group.
 * @property {string} SHAPES Sets the current toolbar as the shapes group.
 * @property {string} INSERT Sets the current toolbar as the insert group.
 * @property {string} MEASURE Sets the current toolbar as the measure group.
 * @property {string} EDIT Sets the current toolbar as the edit group.
 * @property {string} FILL_AND_SIGN Sets the current toolbar as the fill and sign group.
 * @property {string} FORMS Sets the current toolbar as the forms group.
 *
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.VIEW);
  });
 */

export default {
  VIEW: 'toolbarGroup-View',
  ANNOTATE: 'toolbarGroup-Annotate',
  SHAPES: 'toolbarGroup-Shapes',
  INSERT: 'toolbarGroup-Insert',
  MEASURE: 'toolbarGroup-Measure',
  EDIT: 'toolbarGroup-Edit',
  FILL_AND_SIGN: 'toolbarGroup-FillAndSign',
  FORMS: 'toolbarGroup-Forms'
};