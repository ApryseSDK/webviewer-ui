/**
 * Sets the units that will be displayed in the measurement tools' styles popup
 * Valid units are: 'mm', 'cm', 'm', 'km', 'mi', 'yd', 'ft', 'in', 'pt'
 * @method WebViewer#setMeasurementUnits
 * @param {Object} units an object which contains the from units and to units
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.setMeasurementUnits({
      from: ['in', 'cm', 'm'],
      to: ['cm', 'm', 'km']
    }); 
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setMeasurementUnits({
    from: ['in', 'cm', 'm'],
    to: ['cm', 'm', 'km']
  }); 
});
 */

export default store => ({ from, to }) => {
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
