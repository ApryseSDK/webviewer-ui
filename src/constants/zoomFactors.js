let minZoom = 0.05;
let maxZoom = 99.99;

export const getMinZoomLevel = () => minZoom;

export const setMinZoomLevel = (zoom) => {
  minZoom = zoom;
};

export const getMaxZoomLevel = () => maxZoom;

export const setMaxZoomLevel = (zoom) => {
  maxZoom = zoom;
};

export const stepToZoomFactorRangesMap = {
  '0.075': [null, 0.8],
  '0.25': [0.8, 1.5],
  '0.5': [1.5, 2.5],
  '1': [2.5, 4],
  '2': [4, 8],
  '4': [8, 32],
  '8': [32, 64],
  '16': [64, null],
};

export const defaultZoomList = [0.1, 0.25, 0.5, 1, 1.25, 1.5, 2, 4, 8, 16, 64];

export default {
  setMinZoomLevel,
  setMaxZoomLevel,
  getMinZoomLevel,
  getMaxZoomLevel
};
