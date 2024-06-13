/**
 * Sets the timezone that will be used in the UI anywhere a date is displayed.
 * A list of timezone names can be found {@link https://momentjs.com/timezone/ at momentjs docs}.
 * @method UI.setTimezone
 * @param {string} timezone Name of the timezone, e.g. "America/New_York", "America/Los_Angeles", "Europe/London".
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setTimezone('Europe/London');
 */

import actions from 'actions';

export default (store) => (timezone) => {
  const { TYPES, checkTypes } = window.Core;
  checkTypes([timezone], [TYPES.STRING], 'UI.setTimezone');
  store.dispatch(actions.setTimezone(timezone));
};