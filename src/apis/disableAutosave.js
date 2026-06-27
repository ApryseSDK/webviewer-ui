import actions from 'actions';

/**
 * Disables auto saving of note content. When disabled, note content will no longer
 * be saved automatically and must be saved or posted manually if needed.
 * @method UI.disableAutosave
 * @example
 * WebViewer(...)
 *   .then(function(instance) {
 *     instance.UI.disableAutosave();
 *   });
 */

export default (store) => () => {
  store.dispatch(actions.setAutosaveEnabled(false));
};