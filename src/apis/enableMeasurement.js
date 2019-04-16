/**
 * Enables measurement feature, affecting any elements related to measurement tools.
 * @method WebViewer#enableMeasurement
 * @example // enable measurement feature
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
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