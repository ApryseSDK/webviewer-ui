import actions from 'actions';

/**
 * Enables auto saving of note content. When enabled, the content of the note will
 * be automatically saved after a certain period of inactivity (default: 1000ms).
 * See more: https://sdk.apryse.com/api/web/UI.html#.setAutosaveInterval__anchor.
 * @method UI.enableAutosave
 * @example
 * WebViewer(...)
 *   .then(function(instance) {
 *     instance.UI.enableAutosave();
 *   });
 */
export default (store) => () => {
  store.dispatch(actions.setAutosaveEnabled(true));
};