import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import hotkeys from 'hotkeys-js';
import { CONTENT_EDIT_SCOPE } from 'constants/contentEdit';
import DataElements from 'constants/dataElement';
import hotkeysManager, { defaultHotkeysScope } from 'helpers/hotkeysManager';

const onContentEditModeEnded = (dispatch, store) => () => {
  dispatch(actions.setIsContentEditingEnabled(false));
  dispatch(actions.enableElement(DataElements.STYLE_PANEL));

  const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(store.getState());
  const ownerDocument = hotkeysManager.contentEditStyleHotkeyDocument || core.getDocumentViewer(activeDocumentViewerKey)?.getViewerElement?.()?.ownerDocument;
  if (hotkeysManager.contentEditStyleHotkeyHandler && ownerDocument) {
    ownerDocument.removeEventListener('keydown', hotkeysManager.contentEditStyleHotkeyHandler, true);
    hotkeysManager.contentEditStyleHotkeyHandler = null;
    hotkeysManager.contentEditStyleHotkeyDocument = null;
  }

  hotkeys.unbind('*', CONTENT_EDIT_SCOPE);
  hotkeys.setScope(defaultHotkeysScope);

  const featureFlags = selectors.getFeatureFlags(store.getState());
  const { customizableUI } = featureFlags;

  const activeCustomRibbon = selectors.getActiveCustomRibbon(store.getState());
  if (customizableUI && core.getToolMode?.()?.name !== 'AnnotationEdit' && activeCustomRibbon === DataElements.EDIT_TEXT_TOOLBAR_GROUP) {
    core.setToolMode('AnnotationEdit');
  }
};

export default onContentEditModeEnded;
