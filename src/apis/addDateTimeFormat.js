import selectors from 'selectors';
import actions from 'actions';

/**
 * Adds a date and time format for the UI date and time dropdowns.
 * List of formats can be found here: {@link https://github.com/iamkun/dayjs/blob/v1.11.1/docs/en/API-reference.md#format-formatstringwithtokens-string dayjs API}.
 * @method UI.addDateTimeFormat
 * @param {object} dateTimeFormat An object containing the date and time formats with the respective keys. At least one of the date or time keys must be present.
 * @param {string} [dateTimeFormat.date] String of date format
 * @param {string} [dateTimeFormat.time] String of time format
 * @param {boolean} [dateTimeFormat.timeFirst] Boolean value to indicate if time should be before date in UI
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.addDateTimeFormat({
        date: 'MM/DD/YYYY',
        time: 'HH:mm:ss',
        timeFirst: true
      });
  });
 */

export default store => dateTimeFormat => {
  if (typeof dateTimeFormat !== 'object') {
    return console.error('UI.addDateTimeFormat: dateTimeFormat must be an object');
  }
  let validKeyFound = false;
  const requiredKeys = ['date', 'time'];
  for (const param of requiredKeys) {
    if (!dateTimeFormat[param]) {
      dateTimeFormat[param] = '';
    } else {
      validKeyFound = true;
    }
  }
  if (!validKeyFound) {
    return console.error(`UI.addDateTimeFormat: dateTimeFormat must contain at least one of the following keys: ${requiredKeys.join(', ')}`);
  }
  store.dispatch(actions.setDateTimeFormats([
    ...selectors.getDateTimeFormats(store.getState()),
    dateTimeFormat,
  ]));
};