/**
 * Set the scrolling behavior of sync scrolling in semantic compare mode.
 * Must be one of the following values:
 * - 'SYNC': scroll synchronously in both documents
 * - 'SKIP_UNMATCHED': scroll according to the next matched position in both documents
 * @method UI.setMultiViewerSyncScrollingMode
 * @param {(string)} multiViewerSyncScrollingMode the scrolling behavior of sync scrolling in semantic comparing mode.
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.setMultiViewerSyncScrollingMode('SYNC');
  });
 */

import actions from 'actions';
import { SYNC_MODES } from 'constants/multiViewerContants';

export default (store) => (multiViewerComparedSyncScrollingMode) => {
  const { TYPES, checkTypes } = window.Core;
  checkTypes([multiViewerComparedSyncScrollingMode], [TYPES.ONE_OF(SYNC_MODES.SYNC, SYNC_MODES.SKIP_UNMATCHED)], 'UI.setMultiViewerSyncScrollingMode');
  store.dispatch(actions.setMultiViewerSyncScrollingMode(multiViewerComparedSyncScrollingMode));
};
