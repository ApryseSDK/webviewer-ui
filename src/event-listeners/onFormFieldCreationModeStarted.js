import actions from 'actions';
import DataElements from 'src/constants/dataElement';
import selectors from 'selectors';

const formBuilderDefaultDisabledKeys = {
  ROTATE_CLOCKWISE: 'rotateClockwise',
  ROTATE_COUNTER_CLOCKWISE: 'rotateCounterClockwise',
  NUMPAD_ROTATE_CLOCKWISE: 'numpadRotateClockwise',
  NUMPAD_ROTATE_COUNTER_CLOCKWISE: 'numpadRotateCounterClockwise',
  OPEN_FILE: 'openFile',
  SEARCH: 'search',
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut',
  NUMPAD_ZOOM_IN: 'numpadZoomIn',
  NUMPAD_ZOOM_OUT: 'numpadZoomOut',
  FIT_SCREEN_WIDTH: 'fitScreenWidth',
  PRINT: 'print',
  BOOKMARK: 'bookmark',
  SWITCH_PAN: 'switchPan',
  PAN: 'pan',
  ARROW: 'arrow',
  CALLOUT: 'callout',
  ERASER: 'eraser',
  FREEHAND: 'freehand',
  IMAGE: 'image',
  LINE: 'line',
  STICKY_NOTE: 'stickyNote',
  ELLIPSE: 'ellipse',
  RECTANGLE: 'rectangle',
  RUBBER_STAMP: 'rubberStamp',
  FREETEXT: 'freetext',
  SIGNATURE: 'signature',
  SQUIGGLY: 'squiggly',
  HIGHLIGHT: 'highlight',
  STRIKEOUT: 'strikeout',
  UNDERLINE: 'underline',
};

const isPanelOpenOnIndexPanelSide = (state) => {
  const panels = selectors.getGenericPanels(state);
  const indexPanelLocation = panels.find((panel) => panel.dataElement === DataElements.INDEX_PANEL)?.location;
  if (!indexPanelLocation) {
    return false;
  }
  const panelsOnIndexPanelSide = panels.filter((panel) => panel.location === indexPanelLocation);
  return panelsOnIndexPanelSide.find((panel) => selectors.isElementOpen(state, panel.dataElement));
};

export default (dispatch, store, hotkeysManager) => async () => {
  dispatch(actions.setCustomElementOverrides('printButton', { disabled: true }));
  dispatch(actions.disableElement('textPopup', 1));
  const isPanelOpen = isPanelOpenOnIndexPanelSide(store.getState());
  await dispatch(actions.enableElement(DataElements.INDEX_PANEL));
  if (!isPanelOpen) {
    dispatch(actions.openElement(DataElements.INDEX_PANEL));
  }

  for (const shortcutKey in formBuilderDefaultDisabledKeys) {
    // There could be keys that already disabled by the user. When we exit from form builder we don't want to enable them.
    if (hotkeysManager.isActive(formBuilderDefaultDisabledKeys[shortcutKey])) {
      hotkeysManager.disableShortcut(formBuilderDefaultDisabledKeys[shortcutKey]);
      hotkeysManager.formBuilderDisabledKeys[shortcutKey] = formBuilderDefaultDisabledKeys[shortcutKey];
    }
  }
};
