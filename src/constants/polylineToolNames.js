import { annotationMapKeys, mapKeyToToolNames } from 'constants/map';

const polylineToolKeys = [
  annotationMapKeys.POLYLINE,
  annotationMapKeys.PERIMETER_MEASUREMENT,
  annotationMapKeys.ARC_MEASUREMENT,
  annotationMapKeys.RECTANGULAR_AREA_MEASUREMENT,
  annotationMapKeys.CLOUDY_RECTANGULAR_AREA_MEASUREMENT,
  annotationMapKeys.AREA_MEASUREMENT,
  annotationMapKeys.CALLOUT,
  annotationMapKeys.POLYGON,
  annotationMapKeys.CLOUD,
  annotationMapKeys.ARC,
];
const polylineToolNamesSet = polylineToolKeys.reduce((acc, key) => {
  const toolNames = mapKeyToToolNames(key);
  if (toolNames) {
    toolNames.forEach((name) => acc.add(name));
  }
  return acc;
}, new Set());

const polylineToolNames = Array.from(polylineToolNamesSet);

export default polylineToolNames;