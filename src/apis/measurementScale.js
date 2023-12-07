import selectors from 'selectors';
import actions from 'actions';

/**
 * Returns all the measurement scale preset options for the given measurement system.
 * @method UI.getMeasurementScalePreset
 * @param {string} measurementSystem The measurement system, can be either 'metric' or 'imperial'.
 * @returns {Array.<Array.<string|Core.Scale>>} All the measurement scale preset options for the given measurement system.
 * @example
WebViewer(...)
  .then(function(instance) {
    console.log(instance.UI.getMeasurementScalePreset('metric'));
  });
 */
export const getMeasurementScalePreset = (store) => (measurementSystem) => selectors.getMeasurementScalePreset(store.getState())[measurementSystem];

/**
 * Adds a new preset option for measurement scales.
 * @method UI.addMeasurementScalePreset
 * @param {object} options Options for adding a new preset option.
 * @param {string} options.measurementSystem The measurement system, can be either 'metric' or 'imperial'.
 * @param {string} options.displayName The display name of the new preset option.
 * @param {Core.Scale} options.presetScale The scale object of the new preset option.
 * @param {number} [options.index] The index at which to insert the new preset option. If not provided, the new preset will be added to the last of the preset options list.
 * @example
WebViewer(...)
  .then(function(instance) {
    const newScale = new instance.Core.Scale([[1, 'mm'], [300, 'mm']]);
    instance.UI.addMeasurementScalePreset({
      measurementSystem: 'metric',
      displayName: '1:300',
      presetScale: newScale,
      index: 5
    });
  });
 */
export const addMeasurementScalePreset = (store) => ({ measurementSystem, displayName, presetScale, index }) => {
  store.dispatch(actions.addMeasurementScalePreset(measurementSystem, [displayName, presetScale], index));
};

/**
 * Adds an existing preset option for measurement scales.
 * @method UI.removeMeasurementScalePreset
 * @param {string} measurementSystem The measurement system, can be either 'metric' or 'imperial'.
 * @param {number} index The index at which to remove the existing preset option.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.removeMeasurementScalePreset('metric', 5);
  });
 */
export const removeMeasurementScalePreset = (store) => (measurementSystem, index) => {
  store.dispatch(actions.removeMeasurementScalePreset(measurementSystem, index));
};

/**
 * Enable multiple scales mode.
 * @method UI.enableMultipleScalesMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableMultipleScalesMode();
  });
 */
export const enableMultipleScalesMode = (store) => () => {
  store.dispatch(actions.setIsMultipleScalesMode(true));
};

/**
 * Disable multiple scales mode.
 * @method UI.disableMultipleScalesMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.disableMultipleScalesMode();
  });
 */
export const disableMultipleScalesMode = (store) => () => {
  store.dispatch(actions.setIsMultipleScalesMode(false));
};

/**
 * Returns whether multiple scales mode is enabled.
 * @method UI.isMultipleScalesModeEnabled
 * @returns {boolean} True if multiple scales mode is enabled, false if multiple scales mode is disabled.
 * @example
WebViewer(...)
  .then(function(instance) {
    console.log(instance.UI.isMultipleScalesModeEnabled());
  });
 */
export const isMultipleScalesModeEnabled = (store) => () => selectors.getIsMultipleScalesMode(store.getState());
