/**
 * Toggles Reader mode of the viewer.
 * Note that Reader mode only works with fullAPI enabled.
 * @method UI.toggleReaderMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.toggleReaderMode();
  });
 */

import { enterReaderMode, exitReaderMode } from 'helpers/readerMode';
import core from 'core';
import selectors from 'selectors';
import { bindToInstance, createInstanceScopedState } from 'core/documentViewers';

const readerModeState = createInstanceScopedState(() => ({ previousDisplayMode: undefined }));

export default (store) => () => {
  const isInReaderMode = selectors.isReaderMode(store.getState());
  const instanceId = selectors.getInstanceId(store.getState());
  const state = readerModeState.get(instanceId);
  if (isInReaderMode) {
    exitReaderMode(store);
    const { previousDisplayMode } = state;
    if (previousDisplayMode) {
      setTimeout(bindToInstance(instanceId, () => core.setDisplayMode(previousDisplayMode)));
      state.previousDisplayMode = undefined;
    }
  } else {
    state.previousDisplayMode = core.getDisplayMode();
    enterReaderMode(store);
  }
};
