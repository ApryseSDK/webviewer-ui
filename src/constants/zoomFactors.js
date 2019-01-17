let minZoom = 0.05;
let maxZoom = 15;

export const getMinZoom = () => minZoom;

export const setMinZoom = (zoom) => {
  minZoom = zoom;
};

export const getMaxZoom = () => maxZoom;

export const setMaxZoom = (zoom) => {
  maxZoom = zoom;
};

export const stepToZoomFactorRangesMap = {
  '0.075': [null, 0.8],
  '0.25': [0.8, 2.5],
  '0.5': [2.5, 6.5],
  '1': [6.5, 15],
  '2': [15, null]
};
