/**
 * Return the annotations that have inline comment enabled on select
 * @method UI.setInlineCommentFilter
 * @param {UI.filterAnnotation} filterAnnotation Function that takes an annotation and returns if the annotation should have inline comment feature enabled when it's selected
 * @example
  WebViewer(...)
  .then(function(instance) {
    // only enable inline comment for free-hand annotations on select
    instance.UI.setInlineCommentFilter((annotation) => {
      return annotation.ToolName === instance.Core.Tools.ToolNames.FREEHAND;
    });
  });
 */

/**
 * Callback that gets passed to {@link UI.setInlineCommentFilter setInlineCommentFilter}.
 * @callback UI.filterAnnotation
 * @param {Core.Annotations.Annotation} annotation Annotation object
 * @returns {boolean} Whether the annotation should have inline comment feature enabled on select.
 */

import actions from 'actions';

export default (store) => (filterFunc) => {
  const { TYPES, checkTypes } = window.Core;
  checkTypes([filterFunc], [TYPES.FUNCTION], 'UI.setInlineCommentFilter');
  store.dispatch(actions.setInlineCommentFilter(filterFunc));
};