import actions from 'actions';

/**
 * @namespace UI.NotesPanel
 */

/**
 * Enables the collapsing of the annotation's text in the Notes Panel.
 *
 * @method UI.NotesPanel.enableTextCollapse
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.enableTextCollapse()
 *
 * });
 */
const enableTextCollapse = store => () => {
  store.dispatch(actions.setNotesPanelTextCollapsing(true));
};

/**
 * Disables the collapsing of the annotation's text in the Notes Panel.
 *
 * @method UI.NotesPanel.disableTextCollapse
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.disableTextCollapse()
 * });
 */
const disableTextCollapse = store => () => {
  store.dispatch(actions.setNotesPanelTextCollapsing(false));
};

/**
 * Enables the collapsing of the replies in the Notes Panel.
 *
 * @method UI.NotesPanel.enableReplyCollapse
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.enableReplyCollapse()
 * });
 */
const enableReplyCollapse = store => () => {
  store.dispatch(actions.setNotesPanelRepliesCollapsing(true));
};

/**
 * Disables the collapsing of the replies in the Notes Panel.
 *
 * @method UI.NotesPanel.disableReplyCollapse
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.disableReplyCollapse()
 * });
 */
const disableReplyCollapse = store => () => {
  store.dispatch(actions.setNotesPanelRepliesCollapsing(false));
};

export {
  enableTextCollapse,
  disableTextCollapse,
  enableReplyCollapse,
  disableReplyCollapse
};