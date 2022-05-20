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

/**
 * Disables the automatic expansion of all the comments threads in the Notes Panel.
 *
 * @method UI.NotesPanel.disableAutoExpandCommentThread
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.disableAutoExpandCommentThread()
 * });
 */
const disableAutoExpandCommentThread = store => () => {
  store.dispatch(actions.setCommentThreadExpansion(false));
};

/**
 * Enables the automatic expansion of the comments threads in the Notes Panel.
 *
 * @method UI.NotesPanel.enableAutoExpandCommentThread
 *
 * @example
 * WebViewer(...).then(async function(instance) {
 *
 *   instance.UI.NotesPanel.enableAutoExpandCommentThread()
 * });
 */
const enableAutoExpandCommentThread = store => () => {
  store.dispatch(actions.setCommentThreadExpansion(true));
};

export {
  enableTextCollapse,
  disableTextCollapse,
  enableReplyCollapse,
  disableReplyCollapse,
  disableAutoExpandCommentThread,
  enableAutoExpandCommentThread
};
