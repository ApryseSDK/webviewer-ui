import actions from 'actions';

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

export default (dispatch, hotkeysManager) => () => {
  dispatch(actions.setCustomElementOverrides('downloadButton', { disabled: true }));
  dispatch(actions.setCustomElementOverrides('saveAsButton', { disabled: true }));
  dispatch(actions.setCustomElementOverrides('printButton', { disabled: true }));
  dispatch(actions.setCustomElementOverrides('filePickerButton', { disabled: true }));
  dispatch(actions.disableElement('textPopup', 1));
  for (const shortcutKey in formBuilderDefaultDisabledKeys) {
    // There could be keys that already disabled by the user. When we exit from form builder we don't want to enable them.
    if (hotkeysManager.isActive(formBuilderDefaultDisabledKeys[shortcutKey])) {
      hotkeysManager.disableShortcut(formBuilderDefaultDisabledKeys[shortcutKey]);
      hotkeysManager.formBuilderDisabledKeys[shortcutKey] = formBuilderDefaultDisabledKeys[shortcutKey];
    }
  }
};
