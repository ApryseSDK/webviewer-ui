export const ZOOM_MIN = 0.05;
export const ZOOM_MAX = 15;
export const stepToZoomFactorRangesMap = {
  '0.075': [ZOOM_MIN, 0.8],
  '0.25': [0.8, 2.5],
  '0.5': [2.5, 6.5],
  '1': [6.5, ZOOM_MAX]
};
