/**
 * Disable certain features in the WebViewer UI.
 * @method WebViewer#disableFeatures
 * @param {string[]} features Array of features to disable. Valid values are 'download' and 'copyText'
 * @example
WebViewer(...)
  .then(function(instance) {
    // disable the copyText feature
    // this will disallow users to copy text through CTRL/CMD + C and disable the copy button
    instance.disableFeatures(['copyText']);
  });
 */

import actions from 'actions';
import { PRIORITY_ONE } from '../constants/actionPriority';

export default store => features => {
  if (!Array.isArray(features)) {
    features = [features];
  }

  store.dispatch({ type: 'DISABLE_FEATURES', payload: features });

  let dataElements = [];
  features.forEach(feature => {
    if (feature === 'download') {
      dataElements = dataElements.concat(['downloadButton']);
    }

    if (feature === 'copyText') {
      dataElements = dataElements.concat(['copyTextButton']);
    }
  });

  store.dispatch(actions.disableElements(dataElements, PRIORITY_ONE));
};
