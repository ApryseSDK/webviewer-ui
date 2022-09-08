/**
 * Set the zoom step size for zooming in/out. The API takes an array of zoomStepFactor that contains two properties:
 * step: zoom step size when zooming in/out. It could be either percentage in a string or a number, ex. 50, '50', or '50%' all indicates 50%.
 * startZoom: The zoom level that the step starts to apply. It could be either percentag in a string or a number, ex. 200, '200', or '200%' all indicates 200%.
 * @method UI.setZoomStepFactors
 * @param {Object[]} zoomStepFactors An array that contains objects of zoomStep and zoom start level. zoomStepFactors must contain at least one zoomStepFactor object that has startZoom: 0
 * @property {number|string} zoomStepFactors[].step Zoom step size as percentage in a string or a number, ex. '50', '50%', or 50 all indicates 50%.
 * @property {number|string} zoomStepFactors[].startZoom Zoom level that the zoom step size starts to apply. It could be percentage in a string or a number, ex. '200', '200%', or 200 all indicates 200%.
 * @example
WebViewer(...)
  .then(function(instance) {
    const documentViewer = instance.Core.documentViewer;
    // you must have a document loaded when calling this api
    documentViewer.addEventListener('documentLoaded', function() {
      instance.UI.setZoomStepFactors([
        {
          step: '25', // indicates 25%, also accepts '25%'
          startZoom: '0'
        },
        {
          step: 50, // indicates 50%
          startZoom: 200 // indicates the step is 50% after zoom level 200%
        },
      ]);
    });
  });
*/

import actions from 'actions';

export default (store) => (zoomStepFactors) => {
  if (!zoomStepFactors.length) {
    return console.warn('zoomStepFactors should have at least one zoomStepFactor object with startZoom equals to 0.');
  }
  const newZoomFactorsHasInitialZoomFactor =
    zoomStepFactors.find((stepFactor) => parseFloat(stepFactor.startZoom) === 0);
  if (!newZoomFactorsHasInitialZoomFactor) {
    return console.warn('zoomStepFactors should have at least one zoomStepFactor object with startZoom equals to 0.');
  }
  const convertedZoomStepFactors = [];
  for (let i = 0; i < zoomStepFactors.length; i++) {
    const { step, startZoom } = zoomStepFactors[i];
    const convertedZoomStepFactor = {};
    const parsedStep = parseFloat(step);
    if (isNaN(parsedStep)) {
      return console.warn('Invalid step input.');
    }
    convertedZoomStepFactor.step = parsedStep;

    const parsedStartZoom = parseFloat(startZoom);
    if (isNaN(parsedStartZoom)) {
      return console.warn('Invalid startZoom input.');
    }
    convertedZoomStepFactor.startZoom = parsedStartZoom;

    convertedZoomStepFactors.push(convertedZoomStepFactor);
  }

  store.dispatch(actions.setZoomStepFactors(convertedZoomStepFactors));
};