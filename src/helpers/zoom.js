import core from 'core';
import { getMaxZoomLevel, getMinZoomLevel } from 'constants/zoomFactors';
import getRootNode, { getInstanceNode } from 'helpers/getRootNode';

function convertZoomStepFactorsToRangesMap(zoomStepFactors) {
  const rangesMap = {};
  zoomStepFactors.sort((a, b) => a.startZoom - b.startZoom);
  for (let i = 0; i < zoomStepFactors.length; i++) {
    const zoomStepFactor = zoomStepFactors[i];
    const nextZoomStepFactor = zoomStepFactors[i + 1];
    rangesMap[`${zoomStepFactor.step / 100}`] =
      nextZoomStepFactor ?
        [
          zoomStepFactor.startZoom / 100,
          nextZoomStepFactor.startZoom / 100
        ] :
        [
          zoomStepFactor.startZoom / 100,
          null
        ];
  }
  return rangesMap;
}

export function getStep(currentZoomFactor) {
  const zoomStepFactors = getInstanceNode().instance.UI.getZoomStepFactors();
  const zoomFactorRangesMap = convertZoomStepFactorsToRangesMap(zoomStepFactors);
  const steps = Object.keys(zoomFactorRangesMap);
  const step = steps.find((step) => {
    const zoomFactorRanges = zoomFactorRangesMap[step];
    return isCurrentZoomFactorInRange(currentZoomFactor, zoomFactorRanges);
  });
  return parseFloat(step);
}

function isCurrentZoomFactorInRange(zoomFactor, ranges) {
  const [rangeLowBound, rangeHighBound] = ranges;
  if (rangeLowBound === null) {
    return zoomFactor < rangeHighBound;
  }
  if (rangeHighBound === null) {
    return zoomFactor >= rangeLowBound;
  }
  return zoomFactor >= rangeLowBound && zoomFactor < rangeHighBound;
}

function getViewCenterAfterScale(scale, isMultiViewerMode = false, documentViewerKey = 1) {
  const documentContainer = isMultiViewerMode ? getRootNode().querySelector(`#DocumentContainer${documentViewerKey}`)
    : getRootNode().querySelectorAll('.DocumentContainer')[0];
  const documentWrapper = isMultiViewerMode ? getRootNode().querySelector(`#Document${documentViewerKey}`)
    : getRootNode().querySelectorAll('.document')[0];
  const clientX = window.innerWidth / 2;
  const clientY = window.innerHeight / 2;

  const x = (clientX + documentContainer.scrollLeft - documentWrapper.offsetLeft) * scale - clientX + documentContainer.offsetLeft;
  const y = (clientY + documentContainer.scrollTop - documentWrapper.offsetTop) * scale - clientY + documentContainer.offsetTop;
  return { x, y };
}

let zoomStepHistory = [];

// Keeping track of changes to zoomFactor outside this helper functions
let storedZoomFactor = -1;

function zoomToInternal(currentZoomFactor, newZoomFactor, isMultiViewerMode = false, documentViewerKey = 1) {
  const scale = newZoomFactor / currentZoomFactor;
  const { x, y } = getViewCenterAfterScale(scale, isMultiViewerMode, documentViewerKey);
  core.zoomTo(newZoomFactor, x, y, documentViewerKey);
  storedZoomFactor = newZoomFactor;
}

function resetZoomStepHistory() {
  zoomStepHistory = [];
}

export function fitToWidth(documentViewerKey = 1) {
  resetZoomStepHistory();
  core.fitToWidth(documentViewerKey);
}

export function fitToPage(documentViewerKey = 1) {
  resetZoomStepHistory();
  core.fitToPage(documentViewerKey);
}

/**
 * zoomIn works as follows. Every time user zooms in we take current zoom level and compare it to
 * zoom factors map which currently is :
 * {
    '0.075': [null, 0.8],
    '0.25': [0.8, 1.5],
    '0.5': [1.5, 2.5],
    '1': [2.5, 4],
    '2': [4, 8],
    '4': [8, 32],
    '8': [32, 64],
    '16': [64, null],
  }
 * Based on the range we select step size from this map. For example if current zoom level is 110% (1.1)
 * then we can see that it falls to range [0.8, 1.5] and step size for this is 0.25. We add this step
 * to current level so we end up to 1.35. We also store this step to stack so we can follow how after few steps we got there.
 *
 * We need to keep the step history to make our steps predictable in all cases.
 * Consider case where we start from zoom level 140% (1.4) and zoomIn. We would end up to 1.4 + 0.25 = 1.65 (165%).
 * If user would now click zoomOut, we would end up 1.65 - 0.5 = 1.15 (115%) which is not the same 140% where we started.
 * But as we store the step history we do 1.65 - 0.25 (value from step history) and end up to 1.4 (140%).
 * @ignore
 */
export function zoomIn(isMultiViewerMode = false, documentViewerKey = 1) {
  const currentZoomFactor = core.getZoom(documentViewerKey);
  if (storedZoomFactor > 0 && currentZoomFactor !== storedZoomFactor) {
    // zoom level was changed by external side effect (like one of core's function to change zoom level)
    // in these cases we need to reset step history
    resetZoomStepHistory();
  }
  if (currentZoomFactor === getMaxZoomLevel()) {
    return;
  }

  let step = getStep(currentZoomFactor);
  if (zoomStepHistory.length > 0 && zoomStepHistory[zoomStepHistory.length - 1] < 0) {
    // if step history has steps and it has been opposite direction (zoomOut)
    // We use that step. This makes sure that when crossing step range, zoom level goes to same
    // as it was when zoomOut was done.
    // We differentiate zoomIn and zoomOut steps by zoomOut steps are negative and zoomIn are positive
    // thus here using absolute value
    step = Math.abs(zoomStepHistory.pop());
  } else {
    // We differentiate zoomIn and zoomOut steps by zoomOut steps are negative and zoomIn are positive
    zoomStepHistory.push(step);
  }
  const newZoomFactor = Math.min(currentZoomFactor + step, getMaxZoomLevel());
  zoomToInternal(currentZoomFactor, newZoomFactor, isMultiViewerMode, documentViewerKey);
}

/**
 * See functionality from zoomIn. zoomOut works same but opposite direction.
 * @ignore
 */
export function zoomOut(isMultiViewerMode = false, documentViewerKey = 1) {
  const currentZoomFactor = core.getZoom(documentViewerKey);
  if (storedZoomFactor > 0 && currentZoomFactor !== storedZoomFactor) {
    // zoom level was changed by external side effect (like one of core's function to change zoom level)
    // in these cases we need to reset step history
    resetZoomStepHistory();
  }
  if (currentZoomFactor === getMinZoomLevel()) {
    return;
  }

  let step = getStep(currentZoomFactor);
  if (zoomStepHistory.length > 0 && zoomStepHistory[zoomStepHistory.length - 1] > 0) {
    // if step history has steps and it has been opposite direction (zoomIn)
    // We use that step. This makes sure that when crossing step range, zoom level goes to same
    // as it was when zoomIn was done.
    // We differentiate zoomIn and zoomOut steps by zoomOut steps are negative and zoomIn are positive
    step = zoomStepHistory.pop();
  } else {
    // We differentiate zoomIn and zoomOut steps by zoomOut steps are negative and zoomIn are positive
    zoomStepHistory.push(-1 * step);
  }
  const newZoomFactor = Math.max(currentZoomFactor - step, getMinZoomLevel());
  zoomToInternal(currentZoomFactor, newZoomFactor, isMultiViewerMode, documentViewerKey);
}

export function zoomTo(newZoomFactor, isMultiViewerMode = false, documentViewerKey = 1) {
  // if user sets certain zoom level, then we reset the step history
  resetZoomStepHistory();
  const currentZoomFactor = core.getZoom(documentViewerKey);
  zoomToInternal(currentZoomFactor, newZoomFactor, isMultiViewerMode, documentViewerKey);
}
