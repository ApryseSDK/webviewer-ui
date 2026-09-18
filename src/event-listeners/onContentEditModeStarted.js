import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import DataElements from 'constants/dataElement';
import { isMobile } from 'src/helpers/device';
import hotkeys from 'hotkeys-js';
import hotkeysManager from 'helpers/hotkeysManager';
import { CONTENT_EDIT_SCOPE } from 'constants/contentEdit';
import {
  CONTENT_EDIT_SHORTCUTS,
  getContentEditShortcutKeyMap,
} from 'helpers/hotkeysUtils';
import { createContentEditStyleBridgeHandler, resolveContentEditShortcutHandler } from 'helpers/contentEditHotkeys';

const onContentEditModeStarted = (dispatch, store) => () => {
  dispatch(actions.setIsContentEditingEnabled(true));
  dispatch(actions.setContentWorkersAsLoaded());
  dispatch(actions.disableElement(DataElements.STYLE_PANEL));

  const getCurrentContentEditShortcutKeyMap = () => getContentEditShortcutKeyMap(selectors.getShortcutKeyMap(store.getState()));
  const shortcutKeyMap = selectors.getShortcutKeyMap(store.getState());
  const contentEditShortcutKeyMap = getContentEditShortcutKeyMap(shortcutKeyMap);
  const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(store.getState());
  const ownerDocument = core.getDocumentViewer(activeDocumentViewerKey)?.getViewerElement?.()?.ownerDocument;
  const previousOwnerDocument = hotkeysManager.contentEditStyleHotkeyDocument;

  if (hotkeysManager.contentEditStyleHotkeyHandler && previousOwnerDocument) {
    previousOwnerDocument.removeEventListener('keydown', hotkeysManager.contentEditStyleHotkeyHandler, true);
  }

  hotkeysManager.contentEditStyleHotkeyHandler = createContentEditStyleBridgeHandler({
    getState: store.getState,
    shortcutKeyMapResolver: getCurrentContentEditShortcutKeyMap,
    hotkeysManager,
  });

  if (ownerDocument) {
    ownerDocument.addEventListener('keydown', hotkeysManager.contentEditStyleHotkeyHandler, true);
    hotkeysManager.contentEditStyleHotkeyDocument = ownerDocument;
  }

  hotkeys.unbind('*', CONTENT_EDIT_SCOPE);
  hotkeys.setScope(CONTENT_EDIT_SCOPE);
  CONTENT_EDIT_SHORTCUTS.forEach((shortcut) => {
    const key = contentEditShortcutKeyMap[shortcut];
    const handler = resolveContentEditShortcutHandler(shortcut, hotkeysManager, store.getState, true);
    if (!key || !handler) {
      return;
    }
    hotkeys(key, CONTENT_EDIT_SCOPE, handler);
  });

  const featureFlags = selectors.getFeatureFlags(store.getState());
  const { customizableUI } = featureFlags;
  // we will not open the panel in legacy + mobile by default as it takes the entire window space
  if (customizableUI || !isMobile()) {
    dispatch(actions.openElement(DataElements.TEXT_EDITING_PANEL));
  }
  const isLoadingModalOpen = selectors.isElementOpen(store.getState(), 'loadingModal');

  if (customizableUI && isLoadingModalOpen) {
    // close the loading modal since we can now open it when in customizable UI mode
    dispatch(actions.closeElement('loadingModal'));
  }
};

export default onContentEditModeStarted;