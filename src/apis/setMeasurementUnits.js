/**
 * Sets the units that will be displayed in the measurement tools' styles popup
 * Valid units are: 'mm', 'cm', 'm', 'km', 'mi', 'yd', 'ft', 'in', 'pt'
 * @method UI.setMeasurementUnits
 * @param {Object} units an object which contains the from units and to units
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.setMeasurementUnits({
      from: ['in', 'cm', 'm'],
      to: ['cm', 'm', 'km']
    });
  });
 */

export default (store) => ({ from, to }) => {
  const { measurementUnits } = store.getState().viewer;

  if (!from) {
    from = measurementUnits.from;
  }
  if (!to) {
    to = measurementUnits.to;
  }

  store.dispatch({
    type: 'SET_MEASUREMENT_UNITS',
    payload: { from, to },
  });
};
