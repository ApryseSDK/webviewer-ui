import core from 'core';
import { PRIORITY_ONE } from 'constants/actionPriority';
import actions from 'actions';

export default store => () => {
  store.dispatch(actions.disableElements([ 
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
    core.getTool(toolName).disabled = true;
  });
  core.setToolMode('AnnotationEdit');
};