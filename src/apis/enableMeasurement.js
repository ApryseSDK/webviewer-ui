/**
 * Enables measurement feature, affecting any elements related to measurement tools.
 * @method WebViewer#enableMeasurement
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  instance.enableMeasurement();
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.enableMeasurement();
});
 */

import core from 'core';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.enableElements([ 
    'measurementToolGroupButton', 
    'measurementOverlay', 
    'distanceMeasurementToolButton', 
    'perimeterMeasurementToolButton', 
    'areaMeasurementToolButton' 
  ], PRIORITY_ONE));

  const measurementToolNames = [
    'AnnotationCreateDistanceMeasurement', 
    'AnnotationCreatePerimeterMeasurement', 
    'AnnotationCreateAreaMeasurement'
  ];
  measurementToolNames.forEach(toolName => {
    core.getTool(toolName).disabled = false;
  });
};