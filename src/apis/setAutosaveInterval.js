import actions from 'actions';

/**
 * Sets the time of inactivity (ms) before text and replies are auto saved
 * when auto saving is enabled. (default: 1000 ms)
 * @method UI.setAutosaveInterval
 * @param {number} [ms] Amount of time of inactivity before note is auto saved
 * @example
 * WebViewer(...)
 *   .then(function(instance) {
 *     instance.UI.enableAutosave();
 *     instance.UI.setAutosaveInterval(1000); // sets debounce time for 1000 ms
 *   });
 */

export default (store) => (ms) => {
  if (ms === undefined || typeof ms !== 'number' || ms < 0) {
    console.warn('setAutosaveInterval requires a non-negative number as an argument');
    return;
  }
  store.dispatch(actions.setAutosaveInterval(ms));
};

