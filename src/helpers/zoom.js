import core from 'core';
import { stepToZoomFactorRangesMap, getMaxZoomLevel, getMinZoomLevel } from 'constants/zoomFactors';

export const zoomIn = () => {
  const currentZoomFactor = core.getZoom();
  if (currentZoomFactor === getMaxZoomLevel()) {
    return;
  }

  const step = getStep(currentZoomFactor);
  const newZoomFactor = currentZoomFactor + step;
  zoomTo(Math.min(newZoomFactor, getMaxZoomLevel()));
};

export const zoomOut = () => {
  const currentZoomFactor = core.getZoom();
  if (currentZoomFactor === getMinZoomLevel()) {
    return;
  }

  const step = getStep(currentZoomFactor);
  const newZoomFactor = currentZoomFactor - step;
  zoomTo(Math.max(newZoomFactor, getMinZoomLevel()));
};

const getStep = currentZoomFactor => {
  const steps = Object.keys(stepToZoomFactorRangesMap);
  const step = steps.find(step => {
    const zoomFactorRanges = stepToZoomFactorRangesMap[step];

    return isCurrentZoomFactorInRange(currentZoomFactor, zoomFactorRanges);
  });

  return parseFloat(step);
};

const isCurrentZoomFactorInRange = (zoomFactor, ranges) => {
  if (ranges[0] === null) {
    return zoomFactor <= ranges[1];
  } else if (ranges[1] === null) {
    return zoomFactor >= ranges[0];
  }
  return zoomFactor >= ranges[0] && zoomFactor <= ranges[1];
};

export const zoomTo = newZoomFactor => {
  const currentZoomFactor = core.getZoom();
  const scale = newZoomFactor / currentZoomFactor;
  const { x, y } = getViewCenterAfterScale(scale); 

  core.zoomTo(newZoomFactor, x, y);
};

const getViewCenterAfterScale = scale => {
  const documentContainer = document.getElementsByClassName('DocumentContainer')[0];
  const documentWrapper = document.getElementsByClassName('document')[0];
  const clientX = window.innerWidth / 2;
  const clientY = window.innerHeight / 2;
  
  const x = (clientX + documentContainer.scrollLeft - documentWrapper.offsetLeft) * scale - clientX + documentContainer.offsetLeft;
  const y = (clientY + documentContainer.scrollTop - documentWrapper.offsetTop) * scale - clientY + documentContainer.offsetTop;

  return { x, y };
};


