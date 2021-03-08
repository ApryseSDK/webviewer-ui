/**
 * Toggles Reader mode of the viewer.
 * Note that Reader mode only works with fullAPI enabled.
 * @method WebViewerInstance#toggleReaderMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.toggleReaderMode();
  });
 */

import { enterReaderMode, exitReaderMode } from 'helpers/readerMode';
import core from 'core';
import selectors from 'selectors';

let previousDisplayMode;

export default store => () => {
  const isInReaderMode = selectors.isReaderMode(store.getState());
  if (isInReaderMode) {
    exitReaderMode(store);
    if (previousDisplayMode) {
      setTimeout(() => {
        core.setDisplayMode(previousDisplayMode);
        previousDisplayMode = undefined;
      });
    }
  } else {
    previousDisplayMode = core.getDisplayMode();
    core.setDisplayMode('Single');
    enterReaderMode(store);
  }
};
