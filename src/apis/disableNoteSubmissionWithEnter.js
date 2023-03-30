import actions from 'actions';

/**
 * Disable the ability to submit notes by only pressing Enter if it had previously been enabled.
 * This will revert note submission to the default which is Ctrl/Cmd + Enter.
 * @method UI.disableNoteSubmissionWithEnter
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.disableNoteSubmissionWithEnter();
  });
 */

export default (store) => () => {
  store.dispatch(actions.setNoteSubmissionEnabledWithEnter(false));
};