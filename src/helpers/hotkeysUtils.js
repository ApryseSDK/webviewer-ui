import { isMac } from './device';

export const EditorModes = {
  DEFAULT: 'viewer',
  SPREADSHEET: 'spreadsheet',
};

export const Shortcuts = {
  ROTATE_CLOCKWISE: 'rotateClockwise',
  ROTATE_COUNTER_CLOCKWISE: 'rotateCounterClockwise',
  NUMPAD_ROTATE_CLOCKWISE: 'numpadRotateClockwise',
  NUMPAD_ROTATE_COUNTER_CLOCKWISE: 'numpadRotateCounterClockwise',
  COPY: 'copy',
  PASTE: 'paste',
  CUT: 'cut',
  UNDO: 'undo',
  REDO: 'redo',
  OPEN_FILE: 'openFile',
  SEARCH: 'search',
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut',
  NUMPAD_ZOOM_IN: 'numpadZoomIn',
  NUMPAD_ZOOM_OUT: 'numpadZoomOut',
  SET_HEADER_FOCUS: 'setHeaderFocus',
  FIT_SCREEN_WIDTH: 'fitScreenWidth',
  PRINT: 'print',
  BOOKMARK: 'bookmark',
  PREVIOUS_PAGE: 'previousPage',
  NEXT_PAGE: 'nextPage',
  UP: 'up',
  DOWN: 'down',
  SWITCH_PAN: 'switchPan',
  SELECT: 'select',
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
  HOME: 'home',
  END: 'end',
  CLOSE: 'close',
  SELECT_ALL: 'selectAll',
  MOVE_TO_EDGE_UP: 'moveToEdgeUp',
  MOVE_TO_EDGE_DOWN: 'moveToEdgeDown',
  MOVE_TO_EDGE_LEFT: 'moveToEdgeLeft',
  MOVE_TO_EDGE_RIGHT: 'moveToEdgeRight',
  ADJUST_SELECTION_UP: 'adjustSelectionUp',
  ADJUST_SELECTION_DOWN: 'adjustSelectionDown',
  ADJUST_SELECTION_LEFT: 'adjustSelectionLeft',
  ADJUST_SELECTION_RIGHT: 'adjustSelectionRight',
  LEFT: 'left',
  RIGHT: 'right',
  ENTER: 'enter',
  TAB: 'tab',
  DELETE: 'delete',
};

export let VIEW_ONLY_SHORTCUTS = [
  Shortcuts.ROTATE_CLOCKWISE,
  Shortcuts.ROTATE_COUNTER_CLOCKWISE,
  Shortcuts.COPY,
  Shortcuts.OPEN_FILE,
  Shortcuts.SEARCH,
  Shortcuts.ZOOM_IN,
  Shortcuts.ZOOM_OUT,
  Shortcuts.SET_HEADER_FOCUS,
  Shortcuts.FIT_SCREEN_WIDTH,
  Shortcuts.PRINT,
  Shortcuts.BOOKMARK,
  Shortcuts.PREVIOUS_PAGE,
  Shortcuts.NEXT_PAGE,
  Shortcuts.UP,
  Shortcuts.DOWN,
  Shortcuts.SWITCH_PAN,
  Shortcuts.SELECT,
  Shortcuts.PAN,
  Shortcuts.CLOSE,
  // the ones below are not included in the shortcuts modal but are supported
  Shortcuts.NUMPAD_ROTATE_CLOCKWISE,
  Shortcuts.NUMPAD_ROTATE_COUNTER_CLOCKWISE,
  Shortcuts.NUMPAD_ZOOM_IN,
  Shortcuts.NUMPAD_ZOOM_OUT,
  Shortcuts.HOME,
  Shortcuts.END,
];

export const setViewOnlyShortcuts = (newShortcuts) => VIEW_ONLY_SHORTCUTS = newShortcuts;
export const getViewOnlyShortcuts = () => VIEW_ONLY_SHORTCUTS;

export const PDFViewerConfig = [
  [Shortcuts.ROTATE_CLOCKWISE, 'option.settings.rotateDocumentClockwise'],
  [Shortcuts.ROTATE_COUNTER_CLOCKWISE, 'option.settings.rotateDocumentCounterclockwise'],
  [Shortcuts.COPY, 'option.settings.copyText'],
  [Shortcuts.PASTE, 'option.settings.pasteText'],
  [Shortcuts.UNDO, 'option.settings.undoChange'],
  [Shortcuts.REDO, 'option.settings.redoChange'],
  [Shortcuts.OPEN_FILE, 'option.settings.openFile'],
  [Shortcuts.SEARCH, 'option.settings.openSearch'],
  [Shortcuts.ZOOM_IN, 'option.settings.zoomIn'],
  [Shortcuts.ZOOM_OUT, 'option.settings.zoomOut'],
  [Shortcuts.SET_HEADER_FOCUS, 'option.settings.setHeaderFocus'],
  [Shortcuts.FIT_SCREEN_WIDTH, 'option.settings.fitScreenWidth'],
  [Shortcuts.PRINT, 'option.settings.print'],
  [Shortcuts.BOOKMARK, 'option.settings.bookmarkOpenPanel'],
  [Shortcuts.PREVIOUS_PAGE, 'option.settings.goToPreviousPage'],
  [Shortcuts.NEXT_PAGE, 'option.settings.goToNextPage'],
  [Shortcuts.UP, 'option.settings.goToPreviousPageArrowUp'],
  [Shortcuts.DOWN, 'option.settings.goToNextPageArrowDown'],
  [Shortcuts.SWITCH_PAN, 'option.settings.holdSwitchPan'],
  [Shortcuts.SELECT, 'option.settings.selectAnnotationEdit'],
  [Shortcuts.PAN, 'option.settings.selectPan'],
  [Shortcuts.ARROW, 'option.settings.selectCreateArrowTool'],
  [Shortcuts.CALLOUT, 'option.settings.selectCreateCalloutTool'],
  [Shortcuts.ERASER, 'option.settings.selectEraserTool'],
  [Shortcuts.FREEHAND, 'option.settings.selectCreateFreeHandTool'],
  [Shortcuts.IMAGE, 'option.settings.selectCreateStampTool'],
  [Shortcuts.LINE, 'option.settings.selectCreateLineTool'],
  [Shortcuts.STICKY_NOTE, 'option.settings.selectCreateStickyTool'],
  [Shortcuts.ELLIPSE, 'option.settings.selectCreateEllipseTool'],
  [Shortcuts.RECTANGLE, 'option.settings.selectCreateRectangleTool'],
  [Shortcuts.RUBBER_STAMP, 'option.settings.selectCreateRubberStampTool'],
  [Shortcuts.FREETEXT, 'option.settings.selectCreateFreeTextTool'],
  [Shortcuts.SIGNATURE, 'option.settings.openSignatureModal'],
  [Shortcuts.SQUIGGLY, 'option.settings.selectCreateTextSquigglyTool'],
  [Shortcuts.HIGHLIGHT, 'option.settings.selectCreateTextHighlightTool'],
  [Shortcuts.STRIKEOUT, 'option.settings.selectCreateTextStrikeoutTool'],
  [Shortcuts.UNDERLINE, 'option.settings.selectCreateTextUnderlineTool'],
  [Shortcuts.CLOSE, 'option.settings.close'],
];

export const SpreadsheetConfig = [
  [Shortcuts.COPY, 'option.settings.spreadsheetEditor.copyText'],
  [Shortcuts.CUT, 'option.settings.spreadsheetEditor.cutText'],
  [Shortcuts.PASTE, 'option.settings.spreadsheetEditor.pasteText'],
  [Shortcuts.UNDO, 'option.settings.spreadsheetEditor.undoChange'],
  [Shortcuts.REDO, 'option.settings.spreadsheetEditor.redoChange'],
  [Shortcuts.SELECT_ALL, 'option.settings.spreadsheetEditor.selectAll'],
  [Shortcuts.MOVE_TO_EDGE_UP, 'option.settings.spreadsheetEditor.moveToEdgeUp'],
  [Shortcuts.MOVE_TO_EDGE_DOWN, 'option.settings.spreadsheetEditor.moveToEdgeDown'],
  [Shortcuts.MOVE_TO_EDGE_LEFT, 'option.settings.spreadsheetEditor.moveToEdgeLeft'],
  [Shortcuts.MOVE_TO_EDGE_RIGHT, 'option.settings.spreadsheetEditor.moveToEdgeRight'],
  [Shortcuts.ADJUST_SELECTION_UP, 'option.settings.spreadsheetEditor.adjustSelectionUp'],
  [Shortcuts.ADJUST_SELECTION_DOWN, 'option.settings.spreadsheetEditor.adjustSelectionDown'],
  [Shortcuts.ADJUST_SELECTION_LEFT, 'option.settings.spreadsheetEditor.adjustSelectionLeft'],
  [Shortcuts.ADJUST_SELECTION_RIGHT, 'option.settings.spreadsheetEditor.adjustSelectionRight'],
  [Shortcuts.UP, 'option.settings.spreadsheetEditor.up'],
  [Shortcuts.DOWN, 'option.settings.spreadsheetEditor.down'],
  [Shortcuts.LEFT, 'option.settings.spreadsheetEditor.left'],
  [Shortcuts.RIGHT, 'option.settings.spreadsheetEditor.right'],
  [Shortcuts.ENTER, 'option.settings.spreadsheetEditor.enter'],
  [Shortcuts.TAB, 'option.settings.spreadsheetEditor.tab'],
  [Shortcuts.DELETE, 'option.settings.spreadsheetEditor.delete'],
];

export const SHORTCUT_CONFIGS = {
  [EditorModes.DEFAULT]: PDFViewerConfig,
  [EditorModes.SPREADSHEET]: SpreadsheetConfig,
};

// prettier-ignore
export const keyMap = {
  [Shortcuts.ROTATE_CLOCKWISE]: 'Control+Shift+=',
  [Shortcuts.ROTATE_COUNTER_CLOCKWISE]: 'Control+Shift+-',
  [Shortcuts.NUMPAD_ROTATE_CLOCKWISE]: 'Control+Shift+Num_Add',
  [Shortcuts.NUMPAD_ROTATE_COUNTER_CLOCKWISE]: 'Control+Shift+Num_Subtract',
  [Shortcuts.COPY]: 'Control+C',
  [Shortcuts.UNDO]: 'Control+Z',
  [Shortcuts.REDO]: 'Control+Shift+Z',
  [Shortcuts.ZOOM_IN]: 'Control+=',
  [Shortcuts.ZOOM_OUT]: 'Control+-',
  [Shortcuts.NUMPAD_ZOOM_IN]: 'Control+Num_Add',
  [Shortcuts.NUMPAD_ZOOM_OUT]: 'Control+Num_Subtract',
  [Shortcuts.SET_HEADER_FOCUS]: 'Control+Alt+Shift+M',
  [Shortcuts.SELECT]: 'Escape',
  [Shortcuts.PAN]: 'P',
  [Shortcuts.ARROW]: 'A',
  [Shortcuts.CALLOUT]: 'C',
  [Shortcuts.ERASER]: 'E',
  [Shortcuts.FREEHAND]: 'F',
  [Shortcuts.IMAGE]: 'I',
  [Shortcuts.LINE]: 'L',
  [Shortcuts.STICKY_NOTE]: 'N',
  [Shortcuts.ELLIPSE]: 'O',
  [Shortcuts.RECTANGLE]: 'R',
  [Shortcuts.FREETEXT]: 'T',
  [Shortcuts.SIGNATURE]: 'S',
  [Shortcuts.SQUIGGLY]: 'G',
  [Shortcuts.HIGHLIGHT]: 'H',
  [Shortcuts.STRIKEOUT]: 'K',
  [Shortcuts.UNDERLINE]: 'U',
  'delete': 'Delete',
  'richText.bold': 'Control+B',
  'richText.italic': 'Control+I',
  'richText.underline': 'Control+U',
  'richText.strikeout': 'Control+K',
  [Shortcuts.HOME]: 'Home',
  [Shortcuts.END]: 'End',
  [Shortcuts.CLOSE]: 'X',
};

export function shortcutAria(shortcut) {
  let aria = keyMap[shortcut];
  if (aria) {
    if (isMac) {
      aria = aria.replace('Control', 'Meta');
    }
    return aria;
  }

  return undefined;
}

/**
 * Available hotkeys that can be passed to {@link UI.Hotkeys#on instance.UI.hotkeys.on} or {@link UI.Hotkeys#off instance.UI.hotkeys.off}. <br/><br/>
 * @name UI.Hotkeys.Keys
 * @enum {string}
 * @property {string} CTRL_SHIFT_EQUAL Rotate the document clockwise
 * @property {string} COMMAND_SHIFT_EQUAL Rotate the document clockwise
 * @property {string} CTRL_SHIFT_MINUS Rotate the document counterclockwise
 * @property {string} COMMAND_SHIFT_MINUS Rotate the document counterclockwise
 * @property {string} CTRL_C Copy selected text or annotations
 * @property {string} COMMAND_C Copy selected text or annotations
 * @property {string} CTRL_V Paste text or annotations
 * @property {string} COMMAND_V Paste text or annotations
 * @property {string} CTRL_Z Undo an annotation change
 * @property {string} COMMAND_Z Undo an annotation change
 * @property {string} CTRL_Y Redo an annotation change
 * @property {string} COMMAND_SHIFT_Z Redo an annotation change
 * @property {string} CTRL_ALT_SHIFT_M Sets focus to the first header element
 * @property {string} COMMAND_ALT_SHIFT_M Sets focus to the first header element
 * @property {string} CTRL_O Open the file picker
 * @property {string} COMMAND_O Open the file picker
 * @property {string} CTRL_F Open the search overlay
 * @property {string} COMMAND_F Open the search overlay
 * @property {string} CTRL_EQUAL Zoom in
 * @property {string} COMMAND_EQUAL Zoom in
 * @property {string} CTRL_MINUS Zoom out
 * @property {string} COMMAND_MINUS Zoom out
 * @property {string} CTRL_0 Fit the document to the screen width in a small screen(< 640px), otherwise fit it to its original size
 * @property {string} COMMAND_0 Fit the document to the screen width in a small screen(< 640px), otherwise fit it to its original size
 * @property {string} CTRL_P Print
 * @property {string} COMMAND_P Print
 * @property {string} CTRL_B Quickly bookmark a page and open the bookmark panel
 * @property {string} COMMAND_B Quickly bookmark a page and open the bookmark panel
 * @property {string} PAGE_UP Go to the previous page
 * @property {string} PAGE_DOWN Go to the next page
 * @property {string} UP Go to the previous page in single layout mode (ArrowUp)
 * @property {string} DOWN Go to the next page in single layout mode (ArrowDown)
 * @property {string} SPACE Hold to switch to Pan mode and release to return to previous tool
 * @property {string} ESCAPE Select the AnnotationEdit tool
 * @property {string} P Select the Pan tool
 * @property {string} A Select the AnnotationCreateArrow tool
 * @property {string} C Select the AnnotationCreateCallout tool
 * @property {string} E Select the AnnotationEraser tool
 * @property {string} F Select the AnnotationCreateFreeHand tool
 * @property {string} I Select the AnnotationCreateStamp tool
 * @property {string} L Select the AnnotationCreateLine tool
 * @property {string} N Select the AnnotationCreateSticky tool
 * @property {string} O Select the AnnotationCreateEllipse tool
 * @property {string} R Select the AnnotationCreateRectangle tool
 * @property {string} Q Select the AnnotationCreateRubberStamp tool
 * @property {string} T Select the AnnotationCreateFreeText tool
 * @property {string} S Open the signature modal or the overlay
 * @property {string} G Select the AnnotationCreateTextSquiggly tool
 * @property {string} H Select the AnnotationCreateTextHighlight tool
 * @property {string} K Select the AnnotationCreateTextStrikeout tool
 * @property {string} U Select the AnnotationCreateTextUnderline tool
 * @property {string} X Close the current tooltip
 */
export const Keys = {
  CTRL_SHIFT_EQUAL: 'ctrl+shift+=',
  COMMAND_SHIFT_EQUAL: 'command+shift+=',
  CTRL_SHIFT_MINUS: 'ctrl+shift+-',
  COMMAND_SHIFT_MINUS: 'command+shift+-',
  CTRL_SHIFT_NUM_ADD: 'ctrl+shift+num_add',
  COMMAND_SHIFT_NUM_ADD: 'command+shift+num_add',
  CTRL_SHIFT_NUM_SUBTRACT: 'ctrl+shift+num_subtract',
  COMMAND_SHIFT_NUM_SUBTRACT: 'command+shift+num_subtract',
  CTRL_ALT_SHIFT_M: 'ctrl+alt+shift+m',
  COMMAND_ALT_SHIFT_M: 'command+alt+shift+m',
  CTRL_C: 'ctrl+c',
  COMMAND_C: 'command+c',
  CTRL_X: 'ctrl+x',
  COMMAND_X: 'command+x',
  CTRL_V: 'ctrl+v',
  COMMAND_V: 'command+v',
  CTRL_Z: 'ctrl+z',
  COMMAND_Z: 'command+z',
  CTRL_Y: 'ctrl+y',
  COMMAND_SHIFT_Z: 'command+shift+z',
  CTRL_O: 'ctrl+o',
  COMMAND_O: 'command+o',
  CTRL_F: 'ctrl+f',
  COMMAND_F: 'command+f',
  CTRL_EQUAL: 'ctrl+=',
  COMMAND_EQUAL: 'command+=',
  CTRL_MINUS: 'ctrl+-',
  COMMAND_MINUS: 'command+-',
  CTRL_NUM_ADD: 'ctrl+num_add',
  COMMAND_NUM_ADD: 'command+num_add',
  CTRL_NUM_SUBTRACT: 'ctrl+num_subtract',
  COMMAND_NUM_SUBTRACT: 'command+num_subtract',
  CTRL_UP: 'ctrl+up',
  COMMAND_UP: 'command+up',
  CTRL_DOWN: 'ctrl+down',
  COMMAND_DOWN: 'command+down',
  CTRL_LEFT: 'ctrl+left',
  COMMAND_LEFT: 'command+left',
  CTRL_RIGHT: 'ctrl+right',
  COMMAND_RIGHT: 'command+right',
  CTRL_A: 'ctrl+a',
  COMMAND_A: 'command+a',
  SHIFT_UP: 'shift+up',
  SHIFT_DOWN: 'shift+down',
  SHIFT_LEFT: 'shift+left',
  SHIFT_RIGHT: 'shift+right',
  CTRL_0: 'ctrl+0',
  COMMAND_0: 'command+0',
  CTRL_P: 'ctrl+p',
  COMMAND_P: 'command+p',
  CTRL_B: 'ctrl+b',
  COMMAND_B: 'command+b',
  ENTER: 'enter',
  PAGE_UP: 'pageup',
  PAGE_DOWN: 'pagedown',
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  TAB: 'tab',
  SPACE: 'space',
  ESCAPE: 'escape',
  HOME: 'home',
  END: 'end',
  DELETE: 'delete',
  P: 'p',
  A: 'a',
  C: 'c',
  E: 'e',
  F: 'f',
  I: 'i',
  L: 'l',
  N: 'n',
  O: 'o',
  R: 'r',
  Q: 'q',
  T: 't',
  S: 's',
  G: 'g',
  H: 'h',
  K: 'k',
  U: 'u',
  X: 'x',
};

export const SpreadsheetShortcutKeyMap = {
  [Shortcuts.COPY]: concatKeys(Keys.CTRL_C, Keys.COMMAND_C),
  [Shortcuts.PASTE]: concatKeys(Keys.CTRL_V, Keys.COMMAND_V),
  [Shortcuts.CUT]: concatKeys(Keys.CTRL_X, Keys.COMMAND_X),
  [Shortcuts.UNDO]: concatKeys(Keys.CTRL_Z, Keys.COMMAND_Z),
  [Shortcuts.REDO]: Keys.CTRL_Y,
  [Shortcuts.SELECT_ALL]: concatKeys(Keys.CTRL_A, Keys.COMMAND_A),
  [Shortcuts.MOVE_TO_EDGE_UP]: concatKeys(Keys.CTRL_UP, Keys.COMMAND_UP),
  [Shortcuts.MOVE_TO_EDGE_DOWN]: concatKeys(Keys.CTRL_DOWN, Keys.COMMAND_DOWN),
  [Shortcuts.MOVE_TO_EDGE_LEFT]: concatKeys(Keys.CTRL_LEFT, Keys.COMMAND_LEFT),
  [Shortcuts.MOVE_TO_EDGE_RIGHT]: concatKeys(Keys.CTRL_RIGHT, Keys.COMMAND_RIGHT),
  [Shortcuts.ADJUST_SELECTION_UP]: Keys.SHIFT_UP,
  [Shortcuts.ADJUST_SELECTION_DOWN]: Keys.SHIFT_DOWN,
  [Shortcuts.ADJUST_SELECTION_LEFT]: Keys.SHIFT_LEFT,
  [Shortcuts.ADJUST_SELECTION_RIGHT]: Keys.SHIFT_RIGHT,
  [Shortcuts.UP]: Keys.UP,
  [Shortcuts.DOWN]: Keys.DOWN,
  [Shortcuts.LEFT]: Keys.LEFT,
  [Shortcuts.RIGHT]: Keys.RIGHT,
  [Shortcuts.ENTER]: Keys.ENTER,
  [Shortcuts.TAB]: Keys.TAB,
  [Shortcuts.DELETE]: Keys.DELETE
};

export function concatKeys(...keys) {
  return keys.join(', ');
}

export function splitKey(key) {
  return key.split(', ');
}

// Default keys for shortcut
export const ShortcutKeys = {
  [Shortcuts.ROTATE_CLOCKWISE]: concatKeys(Keys.CTRL_SHIFT_EQUAL, Keys.COMMAND_SHIFT_EQUAL),
  [Shortcuts.ROTATE_COUNTER_CLOCKWISE]: concatKeys(Keys.CTRL_SHIFT_MINUS, Keys.COMMAND_SHIFT_MINUS),
  [Shortcuts.NUMPAD_ROTATE_CLOCKWISE]: concatKeys(Keys.CTRL_SHIFT_NUM_ADD, Keys.COMMAND_SHIFT_NUM_ADD),
  [Shortcuts.NUMPAD_ROTATE_COUNTER_CLOCKWISE]: concatKeys(Keys.CTRL_SHIFT_NUM_SUBTRACT, Keys.COMMAND_SHIFT_NUM_SUBTRACT),
  [Shortcuts.COPY]: concatKeys(Keys.CTRL_C, Keys.COMMAND_C),
  [Shortcuts.PASTE]: concatKeys(Keys.CTRL_V, Keys.COMMAND_V),
  [Shortcuts.UNDO]: concatKeys(Keys.CTRL_Z, Keys.COMMAND_Z),
  [Shortcuts.REDO]: concatKeys(Keys.CTRL_Y, Keys.COMMAND_SHIFT_Z),
  [Shortcuts.OPEN_FILE]: concatKeys(Keys.CTRL_O, Keys.COMMAND_O),
  [Shortcuts.SEARCH]: concatKeys(Keys.CTRL_F, Keys.COMMAND_F),
  [Shortcuts.ZOOM_IN]: concatKeys(Keys.CTRL_EQUAL, Keys.COMMAND_EQUAL),
  [Shortcuts.ZOOM_OUT]: concatKeys(Keys.CTRL_MINUS, Keys.COMMAND_MINUS),
  [Shortcuts.NUMPAD_ZOOM_IN]: concatKeys(Keys.CTRL_NUM_ADD, Keys.COMMAND_NUM_ADD),
  [Shortcuts.NUMPAD_ZOOM_OUT]: concatKeys(Keys.CTRL_NUM_SUBTRACT, Keys.COMMAND_NUM_SUBTRACT),
  [Shortcuts.SET_HEADER_FOCUS]: concatKeys(Keys.CTRL_ALT_SHIFT_M, Keys.COMMAND_ALT_SHIFT_M),
  [Shortcuts.FIT_SCREEN_WIDTH]: concatKeys(Keys.CTRL_0, Keys.COMMAND_0),
  [Shortcuts.PRINT]: concatKeys(Keys.CTRL_P, Keys.COMMAND_P),
  [Shortcuts.BOOKMARK]: concatKeys(Keys.CTRL_B, Keys.COMMAND_B),
  [Shortcuts.PREVIOUS_PAGE]: Keys.PAGE_UP,
  [Shortcuts.NEXT_PAGE]: Keys.PAGE_DOWN,
  [Shortcuts.UP]: Keys.UP,
  [Shortcuts.DOWN]: Keys.DOWN,
  [Shortcuts.SWITCH_PAN]: Keys.SPACE,
  [Shortcuts.SELECT]: Keys.ESCAPE,
  [Shortcuts.PAN]: Keys.P,
  [Shortcuts.ARROW]: Keys.A,
  [Shortcuts.CALLOUT]: Keys.C,
  [Shortcuts.ERASER]: Keys.E,
  [Shortcuts.FREEHAND]: Keys.F,
  [Shortcuts.IMAGE]: Keys.I,
  [Shortcuts.LINE]: Keys.L,
  [Shortcuts.STICKY_NOTE]: Keys.N,
  [Shortcuts.ELLIPSE]: Keys.O,
  [Shortcuts.RECTANGLE]: Keys.R,
  [Shortcuts.RUBBER_STAMP]: Keys.Q,
  [Shortcuts.FREETEXT]: Keys.T,
  [Shortcuts.SIGNATURE]: Keys.S,
  [Shortcuts.SQUIGGLY]: Keys.G,
  [Shortcuts.HIGHLIGHT]: Keys.H,
  [Shortcuts.STRIKEOUT]: Keys.K,
  [Shortcuts.UNDERLINE]: Keys.U,
  [Shortcuts.HOME]: Keys.HOME,
  [Shortcuts.END]: Keys.END,
  [Shortcuts.CLOSE]: Keys.X,
};

export const ToolNameHotkeyMap = {
  AnnotationEdit: Keys.ESCAPE,
  Pan: Keys.P,
  AnnotationCreateArrow: Keys.A,
  AnnotationCreateCallout: Keys.C,
  AnnotationEraserTool: Keys.E,
  AnnotationCreateFreeHand: Keys.F,
  AnnotationCreateStamp: Keys.I,
  AnnotationCreateLine: Keys.L,
  AnnotationCreateSticky: Keys.N,
  AnnotationCreateEllipse: Keys.O,
  AnnotationCreateRectangle: Keys.R,
  AnnotationCreateFreeText: Keys.T,
  AnnotationCreateSignature: Keys.S,
  AnnotationCreateTextSquiggly: Keys.G,
  AnnotationCreateTextHighlight: Keys.H,
  AnnotationCreateTextStrikeout: Keys.K,
  AnnotationCreateTextUnderline: Keys.U,
  AnnotationCreateRubberStamp: Keys.Q
};

/**
 * @ignore
 * Generates a map from shortcut identifiers to tool names.
 *
 * This combines ShortcutKeys and ToolNameHotkeyMap to create a direct mapping
 * that allows looking up which tool a shortcut activates.
 *
 * @returns {Object.<string, string>} A map where:
 *   - key: shortcut identifier (e.g., "CTRL_A", "SHIFT_P")
 *   - value: tool name (e.g., "AnnotationCreateTextHighlight", "Pan")
 */
export function generateShortcutToToolNameMap() {
  const keyToToolName = Object.fromEntries(
    Object.entries(ToolNameHotkeyMap).map(([toolName, key]) => [key, toolName])
  );

  return Object.entries(ShortcutKeys).reduce((map, [shortcut, keys]) => {
    if (keyToToolName[keys]) {
      map[shortcut] = keyToToolName[keys];
    }
    return map;
  }, {});
}

let _shortcutToToolNameMap = null;

/**
  * @ignore
  * Check if a shortcut's associated tool is in the provided tool name list
  * @param {string} shortcut - The shortcut identifier (e.g., Shortcuts.ERASER)
  * @param {string[]} toolNames - Array of tool names to check against
  * @returns {boolean} True if the shortcut's tool is in the list
  * @example
  * isShortcutInToolList(Shortcuts.ERASER, ['AnnotationEraserTool']) // returns true
  * isShortcutInToolList(Shortcuts.ERASER, ['Pan']) // returns false
 */
export function isShortcutInToolList(shortcut, toolNames) {
  if (!shortcut || !Array.isArray(toolNames)) {
    return false;
  }
  if (!_shortcutToToolNameMap) {
    _shortcutToToolNameMap = generateShortcutToToolNameMap();
  }
  const toolName = _shortcutToToolNameMap[shortcut];
  return toolName && toolNames.includes(toolName);
}


