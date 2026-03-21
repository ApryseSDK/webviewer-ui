import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';

/**
 * @ignore
 * Handles debounced Office Editor comment thread additions by selecting the new annotation and opening the appropriate comment UI for immediate editing.
 * From a UX flow perspective:
 * - We create a new comment thread with an empty message first.
 * - The UI receives COMMENT_THREAD_ADDED_DEBOUNCED with the final annotation id.
 * - The UI selects that annotation and focuses the input so the user can immediately type.
 * - The UI then "amends" the comment with the typed message.
 * - That keeps the internal flow (create-empty-then-update) hidden while the user experiences a seamless "add comment and type" interaction.
 */
export default ({ dispatch, getState }, core) => (id) => {
  const state = getState();
  const isOECommentPanelDisabled = selectors.isElementDisabled(state, DataElements.OFFICE_EDITOR_COMMENT_PANEL);
  const isOECommentPanelOpen = selectors.isElementOpen(state, DataElements.OFFICE_EDITOR_COMMENT_PANEL);
  const isInlineCommentDisabled = selectors.isElementDisabled(state, DataElements.INLINE_COMMENT_POPUP);

  if (isOECommentPanelDisabled && isInlineCommentDisabled) {
    return;
  }

  core.deselectAllAnnotations();
  const annotation = core.getAnnotationById(id);
  if (!annotation) {
    return;
  }
  if (!isOECommentPanelOpen) {
    if (isInlineCommentDisabled) {
      dispatch(actions.openElement(DataElements.OFFICE_EDITOR_COMMENT_PANEL));
    } else {
      dispatch(actions.openElement(DataElements.INLINE_COMMENT_POPUP));
    }
  }
  core.selectAnnotation(annotation);
  dispatch(actions.triggerNoteEditing());
};
