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
 * @property {string} REDACT Sets the current toolbar as the redact group.
 *
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setToolbarGroup(instance.UI.ToolbarGroup.VIEW);
  });
 */

import DataElements from './dataElement';

export default {
  VIEW: DataElements.VIEW_TOOLBAR_GROUP,
  ANNOTATE: DataElements.ANNOTATE_TOOLBAR_GROUP,
  SHAPES: DataElements.SHAPES_TOOLBAR_GROUP,
  INSERT: DataElements.INSERT_TOOLBAR_GROUP,
  MEASURE: DataElements.MEASURE_TOOLBAR_GROUP,
  EDIT: DataElements.EDIT_TOOLBAR_GROUP,
  EDIT_TEXT: DataElements.EDIT_TEXT_TOOLBAR_GROUP,
  FILL_AND_SIGN: DataElements.FILL_AND_SIGN_TOOLBAR_GROUP,
  FORMS: DataElements.FORMS_TOOLBAR_GROUP,
  REDACT: DataElements.REDACT_TOOLBAR_GROUP
};