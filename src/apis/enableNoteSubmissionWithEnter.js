import actions from 'actions';

/**
 * Enable the ability to submit notes by only pressing Enter. Default mode is Ctrl/Cmd + Enter.
 * @method UI.enableNoteSubmissionWithEnter
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableNoteSubmissionWithEnter();
  });
 */

export default store => () => {
  store.dispatch(actions.setNoteSubmissionEnabledWithEnter(true));
};