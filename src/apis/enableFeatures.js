/**
 * Enable certain features in the WebViewer UI.
 * @method WebViewer#enableFeatures
 * @param {string[]} features Array of features to enable. Valid values are 'download' and 'copyText'
 * @example
WebViewer(...)
  .then(function(instance) {
    // enable the copyText feature
    // this will allow users to copy text through CTRL/CMD + C and enable the copy button
    instance.enableFeatures(['copyText']);
  });
 */

import actions from 'actions';
import { PRIORITY_ONE } from '../constants/actionPriority';

export default store => features => {
  if (!Array.isArray(features)) {
    features = [features];
  }

  store.dispatch({ type: 'ENABLE_FEATURES', payload: features });

  let dataElements = [];
  features.forEach(feature => {
    if (feature === 'download') {
      dataElements = dataElements.concat(['downloadButton']);
    }

    if (feature === 'copyText') {
      dataElements = dataElements.concat(['copyTextButton']);
    }
  });

  store.dispatch(actions.enableElements(dataElements, PRIORITY_ONE));
};
