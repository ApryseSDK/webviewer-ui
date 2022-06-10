/**
 * Set the zoom step size for zooming in/out.
 * @method UI.setZoomStepFactors
 * @param {zoomStepFactor[]} zoomStepFactors an array that contains objects of zoomStep and zoom start level. zoomStepFactors must contain at least one zoomStepFactor object that has startZoom: 0
 * @typedef {Object} zoomStepFactor
 * @property {number} zoomStepFactor.step zoom step size in %, should always be positive
 * @property {number} zoomStepFactor.startZoom zoom level that the zoom step size start to apply, should always be positive.
 * @example
WebViewer(...)
  .then(function(instance) {
    const documentViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    documentViewer.addEventListener('documentLoaded', function() {
      instance.UI.setZoomStepFactors([
        {
          step: 50,
          startZoom: 0
        }
      ]);
    });
  });
*/

import actions from 'actions';

export default store => zoomStepFactors => {
  if (!zoomStepFactors.length) {
    return console.warn('Invalid Input');
  }
  const newZoomFactorsHasInitialZoomFactor =
    zoomStepFactors.find(stepFactor => stepFactor.startZoom === 0);
  if (!newZoomFactorsHasInitialZoomFactor) {
    return console.warn('zoomStepFactors should have at least one zoomStepFactor object with startZoom equals to 0.');
  }
  for (let i = 0; i < zoomStepFactors.length; i++) {
    const zoomStepFactor = zoomStepFactors[i];
    if (
      zoomStepFactor['step'] === undefined ||
      typeof zoomStepFactor.step !== 'number' ||
      zoomStepFactor['step'] < 0
    ) {
      return console.warn('zoomStepFactor object must have a property called "step" with a positive number as its value.');
    }
    if (
      zoomStepFactor['startZoom'] === undefined ||
      typeof zoomStepFactor.startZoom !== 'number' ||
      zoomStepFactor['startZoom'] < 0
    ) {
      return console.warn('zoomStepFactor objectm ust have a property called "startZoom" with a positive number as its value.');
    }
  }
  store.dispatch(actions.setZoomStepFactors(zoomStepFactors));
};