let minZoom = 0.05;
let maxZoom = 99.99;

export const getMinZoomLevel = () => minZoom;

export const setMinZoomLevel = zoom => {
  minZoom = zoom;
};

export const getMaxZoomLevel = () => maxZoom;

export const setMaxZoomLevel = zoom => {
  maxZoom = zoom;
};

export const stepToZoomFactorRangesMap = {
  '0.075': [null, 0.8],
  '0.25': [0.8, 1.5],
  '1': [1.5, 3.5],
  '2': [3.5, 8],
  '4': [8, 32],
  '8': [32, 64],
  '16': [64, null],
};

export default {
  setMinZoomLevel,
  setMaxZoomLevel,
};
