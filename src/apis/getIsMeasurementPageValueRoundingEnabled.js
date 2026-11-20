import selectors from 'selectors';

/**
 * Gets whether or not page scale value rounding is enabled.
 * When enabled, manually-typed values are rounded, e.g. if the user types "1.234", it will be rounded and stored as "1.2" with precision=0.1.
 * Meanwhile, calibrated page values only appear to be rounded. Under the hood, calibrated page values are stored with full precision to prevent rounding errors in scale operations.
 * When disabled, all page values are stored and displayed with full precision.
 * @method UI.getIsMeasurementPageValueRoundingEnabled
 * @example
 * WebViewer(...)
 *  .then(function(instance) {
 *   const isMeasurementPageValueRoundingEnabled = instance.UI.getIsMeasurementPageValueRoundingEnabled();
 * });
 */
const getIsMeasurementPageValueRoundingEnabled = (store) => () => selectors.getIsMeasurementPageValueRoundingEnabled(store.getState());
export default getIsMeasurementPageValueRoundingEnabled;