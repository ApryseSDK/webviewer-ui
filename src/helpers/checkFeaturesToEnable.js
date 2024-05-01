import { mapKeyToToolNames, annotationMapKeys } from 'constants/map';
import Feature from 'constants/feature';
import { getInstanceNode } from './getRootNode';
import DataElements from 'constants/dataElement';

const checkFeaturesToEnable = (componentsMap) => {
  const keys = Object.keys(componentsMap);
  const measurementTools = [
    mapKeyToToolNames(annotationMapKeys.DISTANCE_MEASUREMENT),
    mapKeyToToolNames(annotationMapKeys.PERIMETER_MEASUREMENT),
    mapKeyToToolNames(annotationMapKeys.ARC_MEASUREMENT),
    mapKeyToToolNames(annotationMapKeys.RECTANGULAR_AREA_MEASUREMENT),
    mapKeyToToolNames(annotationMapKeys.CLOUDY_RECTANGULAR_AREA_MEASUREMENT),
    mapKeyToToolNames(annotationMapKeys.AREA_MEASUREMENT),
    mapKeyToToolNames(annotationMapKeys.ELLIPSE_MEASUREMENT),
    mapKeyToToolNames(annotationMapKeys.COUNT_MEASUREMENT),
  ].flat();
  const contentEditTools = mapKeyToToolNames(annotationMapKeys.CONTENT_EDIT_TOOL);
  const redactTools = mapKeyToToolNames(annotationMapKeys.REDACTION);
  const instance = getInstanceNode().instance;

  for (let index = 0, len = keys.length; index < len; index++) {
    const element = componentsMap[keys[index]];
    if (element.dataElement === DataElements.FILE_PICKER_BUTTON) {
      instance.UI.enableFilePicker();
    } else if (element.dataElement === DataElements.CREATE_PORTFOLIO) {
      instance.UI.enableFeatures(Feature.Portfolio);
    } else if (redactTools.indexOf(element.toolName) > -1) {
      instance.UI.enableRedaction();
    } else if (measurementTools.indexOf(element.toolName) > -1) {
      instance.UI.enableMeasurement();
    } else if (contentEditTools.indexOf(element.toolName) > -1) {
      instance.UI.enableFeatures(Feature.ContentEdit);
    }
  }
};

export default checkFeaturesToEnable;