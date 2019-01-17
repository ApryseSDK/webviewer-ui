let minZoom = 0.05;
let maxZoom = 15;

export const getMinZoomLevel = () => minZoom;

export const setMinZoomLevel = (zoom) => {
  if (typeof zoom === 'string') {
    minZoom = Number.parseFloat(zoom) / 100;
  } else {
    minZoom = zoom;
  }
};

export const getMaxZoomLevel = () => maxZoom;

export const setMaxZoomLevel = (zoom) => {
  if (typeof zoom === 'string') {
    maxZoom = Number.parseFloat(zoom) / 100;
  } else {
    maxZoom = zoom;
  }
};

export const stepToZoomFactorRangesMap = {
  '0.075': [null, 0.8],
  '0.25': [0.8, 2.5],
  '0.5': [2.5, 6.5],
  '1': [6.5, 15],
  '2': [15, null]
};
