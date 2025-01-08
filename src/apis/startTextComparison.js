/**
 * Activate text comparison
 * (Only works when in MultiViewerMode with PDFs loaded for both sides)
 * @method UI.startTextComparison
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.startTextComparison();
  });
 */

import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import Events from 'constants/events';

export default (store) => () => {
  if (!selectors.isMultiViewerMode(store.getState())) {
    return console.error('Must be in MultiViewerMode to use this API, use "instance.UI.enterMultiViewerMode()"');
  }
  const documentViewers = core.getDocumentViewers();
  if (documentViewers.length < 2) {
    window.addEventListener(Events.MULTI_VIEWER_READY, () => {
      const documentViewers = core.getDocumentViewers();
      documentViewers[0].startSemanticDiff(documentViewers[1]);
    });
  }
  documentViewers[0].startSemanticDiff(documentViewers[1]);
  store.dispatch(actions.setIsMultiViewerMode(true));
};