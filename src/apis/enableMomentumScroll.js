/**
 * Diligent
 *
 * Enable or disable momentum scrolling of documents.
 * @method WebViewerInstance#enableMomentumScroll
 * @param {boolean} momentumScrollEnabled enable or disable momentum scrolling via API
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.setMomentumScrollEnabled(false);
  });
 */

import TouchEventManager from 'helpers/TouchEventManager';

export default momentumScrollEnabled => {
    TouchEventManager.momentumScrollEnabled = momentumScrollEnabled;
};
