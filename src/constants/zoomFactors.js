let minZoom = 0.05;
let maxZoom = 99.99;

export const getMinZoomLevel = () => minZoom;

export const setMinZoomLevel = zoom => minZoom = zoom;

export const getMaxZoomLevel = () => maxZoom;

export const setMaxZoomLevel = zoom => maxZoom = zoom;

export const stepToZoomFactorRangesMap = {
  '0.075': [null, 0.8],
  '0.25': [0.8, 2.5],
  '0.5': [2.5, 6.5],
  '1': [6.5, 15],
  '2': [15, null]
};

export default {
  setMinZoomLevel,
  setMaxZoomLevel
};
