import hotkeys from 'hotkeys-js';

import core from 'core';
import i18next from 'i18next';
import { isMac, isMobile } from 'helpers/device';
import openFilePicker from 'helpers/openFilePicker';
import copyText from 'helpers/copyText';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import { zoomIn, zoomOut } from 'helpers/zoom';
import { print } from 'helpers/print';
import createTextAnnotationAndSelect from 'helpers/createTextAnnotationAndSelect';
import isFocusingElement from 'helpers/isFocusingElement';
import getNumberOfPagesToNavigate from 'helpers/getNumberOfPagesToNavigate';
import setCurrentPage from 'helpers/setCurrentPage';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';

export const Shortcuts = {
  ROTATE_CLOCKWISE: 'rotateClockwise',
  ROTATE_COUNTER_CLOCKWISE: 'rotateCounterClockwise',
  COPY: 'copy',
  PASTE: 'paste',
  UNDO: 'undo',
  REDO: 'redo',
  OPEN_FILE: 'openFile',
  SEARCH: 'search',
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut',
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
  UNDERLINE: 'underline'
};

// prettier-ignore
const keyMap = {
  [Shortcuts.ROTATE_CLOCKWISE]: 'Control+Shift+=',
  [Shortcuts.ROTATE_COUNTER_CLOCKWISE]: 'Control+Shift+-',
  [Shortcuts.COPY]: 'Control+C',
  [Shortcuts.UNDO]: 'Control+Z',
  [Shortcuts.REDO]: 'Control+Shift+Z',
  [Shortcuts.ZOOM_IN]: 'Control+=',
  [Shortcuts.ZOOM_OUT]: 'Control+-',
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

const NOOP = () => {};

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
 */
export const Keys = {
  CTRL_SHIFT_EQUAL: 'ctrl+shift+=',
  COMMAND_SHIFT_EQUAL: 'command+shift+=',
  CTRL_SHIFT_MINUS: 'ctrl+shift+-',
  COMMAND_SHIFT_MINUS: 'command+shift+-',
  CTRL_C: 'ctrl+c',
  COMMAND_C: 'command+c',
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
  SPACE: 'space',
  ESCAPE: 'escape',
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
};

export function concatKeys(...keys) {
  return keys.join(', ');
}

function splitKey(key) {
  return key.split(', ');
}

// Defalut keys for shortcut
export const ShortcutKeys = {
  [Shortcuts.ROTATE_CLOCKWISE]: concatKeys(Keys.CTRL_SHIFT_EQUAL, Keys.COMMAND_SHIFT_EQUAL),
  [Shortcuts.ROTATE_COUNTER_CLOCKWISE]: concatKeys(Keys.CTRL_SHIFT_MINUS, Keys.COMMAND_SHIFT_MINUS),
  [Shortcuts.COPY]: concatKeys(Keys.CTRL_C, Keys.COMMAND_C),
  [Shortcuts.PASTE]: concatKeys(Keys.CTRL_V, Keys.COMMAND_V),
  [Shortcuts.UNDO]: concatKeys(Keys.CTRL_Z, Keys.COMMAND_Z),
  [Shortcuts.REDO]: concatKeys(Keys.CTRL_Y, Keys.COMMAND_SHIFT_Z),
  [Shortcuts.OPEN_FILE]: concatKeys(Keys.CTRL_O, Keys.COMMAND_O),
  [Shortcuts.SEARCH]: concatKeys(Keys.CTRL_F, Keys.COMMAND_F),
  [Shortcuts.ZOOM_IN]: concatKeys(Keys.CTRL_EQUAL, Keys.COMMAND_EQUAL),
  [Shortcuts.ZOOM_OUT]: concatKeys(Keys.CTRL_MINUS, Keys.COMMAND_MINUS),
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
  [Shortcuts.UNDERLINE]: Keys.U
};

const ToolNameHotkeyMap = {
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

const unbindedHotkeysMap = {};

export const defaultHotkeysScope = 'viewer';

/**
 * A class which contains hotkeys APIs.<br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> You must NOT instantiate this yourself. Access instances of this class using {@link UI.hotkeys instance.UI.hotkeys}
 * @namespace Hotkeys
 * @memberof UI
 */
const HotkeysManager = {
  initialize(store) {
    // still allow hotkeys when focusing a textarea or an input
    hotkeys.filter = () => true;
    this.store = store;
    this.keyHandlerMap = this.createKeyHandlerMap();
    this.prevToolName = null;
    const shortcutKeyMap = this.getShortcutKeyMap();
    Object.keys(shortcutKeyMap).forEach((shortcut) => {
      this.on(shortcutKeyMap[shortcut], this.keyHandlerMap[ShortcutKeys[shortcut]]);
    });
    this.didInitializeAllKeys = true;
    hotkeys.setScope(defaultHotkeysScope);
  },
  /**
   * Add an event handler for the given hotkey
   * @method UI.Hotkeys.on
   * @param {string|UI.Hotkeys.Keys} key A keyboard key <br/>
   * If a hotkey is consisted of more than one key. Those keys should be connected using '+'.
   * @param {function|object} [handler] An optional argument <br/>
   * If it is undefined, the default handler of the given key will be registered <br/>
   * If it is an function, it will be called on key down <br/>
   * If it is an object, it should have the shape of { keydown: func1, keyup: func2 }. Func1 will be called on keydown while func2 will be called on keyup
   * @example
WebViewer(...)
  .then(function(instance) {
    const { UI } = instance;
      // this will register the default zoom in handler
      UI.hotkeys.on(UI.hotkeys.Keys.CTRL_EQUAL);
      UI.hotkeys.on(UI.hotkeys.Keys.COMMAND_EQUAL);

      // this will be called on keydown
      UI.hotkeys.on('ctrl+d, command+d', e => {
        e.preventDefault();
        instance.Core.documentViewer.closeDocument();
      });

      UI.hotkeys.on('ctrl+g', {
        keydown: e => {
          console.log('ctrl+g is pressed!');
        },
        keyup: e => {
          console.log('ctrl+g is released!')
        },
      });
  });
   */
  on(key, handler) {
    const isToolName = !!core.getToolModeMap()[key];
    if (isToolName) {
      key = ToolNameHotkeyMap[key];
    }

    if (!handler) {
      handler = this.keyHandlerMap[key];
    }

    function enableHotkey(_key, _handler) {
      // https://github.com/jaywcjlove/hotkeys#defining-shortcuts
      const { keyup = NOOP, keydown = _handler } = _handler;
      hotkeys(_key, { keyup: true, scope: defaultHotkeysScope }, (e) => {
        if (e.type === 'keyup') {
          keyup(e);
        }
        if (e.type === 'keydown') {
          keydown(e);
        }
      });
    }

    if ((!key || !handler) && !this.didInitializeAllKeys) {
      this.keyHandlerMap = this.createKeyHandlerMap();
      this.prevToolName = null;
      Object.keys(this.keyHandlerMap).forEach((_key) => {
        // Check if the "key" has already been inilized
        if (!unbindedHotkeysMap[_key]) {
          enableHotkey(_key, this.keyHandlerMap[_key]);
        }
      });
      this.didInitializeAllKeys = true;
    }

    // when key is undefined we need to set all keys to true
    if (!key) {
      for (const property in Keys) {
        unbindedHotkeysMap[Keys[property]] = true;
      }
    } else {
      unbindedHotkeysMap[key.toLocaleLowerCase()] = true;
    }

    if (!key || !handler) {
      return;
    }

    enableHotkey(key, handler);
  },
  /**
   * Remove an event handler for the given hotkey
   * @method UI.Hotkeys.off
   * @param {string|UI.Hotkeys.Keys} [key] An optional keyboard key. If not passed, all handlers will be removed
   * @param {function} [handler] An optional function. If not passed, all handlers of the given key will be removed
   * @example
WebViewer(...)
  .then(function(instance) {
      // this will remove all handlers for ctrl = and command =
      instance.UI.hotkeys.off(instance.UI.hotkeys.Keys.CTRL_EQUAL);
      instance.UI.hotkeys.off(instance.UI.hotkeys.Keys.COMMAND_EQUAL);
  });
   */
  off(key, handler) {
    const isToolName = !!core.getToolModeMap()[key];
    if (isToolName) {
      key = ToolNameHotkeyMap[key];

      // need to return here otherwise all the handlers will be removed
      // if the tool name doesn't have a corresponding hotkey
      if (!key) {
        return;
      }
    }

    // when key is undefined hotkeysjs unbinds all handler
    // here we need to flag all keys too
    if (!key) {
      for (const property in Keys) {
        unbindedHotkeysMap[Keys[property]] = false;
      }
      this.didInitializeAllKeys = false;
    } else {
      unbindedHotkeysMap[key.toLocaleLowerCase()] = false;
    }

    // https://github.com/jaywcjlove/hotkeys#unbind
    hotkeys.unbind(key, handler);
  },
  isActive(shortcut) {
    const key = keyMap[shortcut];
    if (key) {
      let hotkeyName;
      // change 'ctrl' to 'command' for Mac OS
      if (isMac) {
        hotkeyName = key.replace('Control', 'command').toLocaleLowerCase();
      } else {
        hotkeyName = key.replace('Control', 'ctrl').toLocaleLowerCase();
      }
      return unbindedHotkeysMap[hotkeyName];
    }
    return true;
  },
  createKeyHandlerMap() {
    const store = this.store;
    const { dispatch, getState } = store;

    return {
      [ShortcutKeys[Shortcuts.ROTATE_CLOCKWISE]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        e.preventDefault();
        core.rotateClockwise(activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.ROTATE_COUNTER_CLOCKWISE]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        e.preventDefault();
        core.rotateCounterClockwise(activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.COPY]]: () => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (core.getSelectedText(activeDocumentViewerKey)) {
          copyText(activeDocumentViewerKey);
          dispatch(actions.closeElement('textPopup'));
        } else if (core.getSelectedAnnotations(activeDocumentViewerKey).length) {
          core.updateCopiedAnnotations(activeDocumentViewerKey);
        }
      },
      [ShortcutKeys[Shortcuts.PASTE]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (!isFocusingElement()) {
          e.preventDefault();
          core.pasteCopiedAnnotations(activeDocumentViewerKey);
        }
      },
      [ShortcutKeys[Shortcuts.UNDO]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (!isFocusingElement()) {
          e.preventDefault();
          core.undo(activeDocumentViewerKey);
        }
      },
      [ShortcutKeys[Shortcuts.REDO]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (!isFocusingElement()) {
          e.preventDefault();
          core.redo(activeDocumentViewerKey);
        }
      },
      [ShortcutKeys[Shortcuts.OPEN_FILE]]: (e) => {
        e.preventDefault();
        openFilePicker();
      },
      [ShortcutKeys[Shortcuts.SEARCH]]: (e) => {
        e.preventDefault();

        const isNotesPanelOpen = selectors.isElementOpen(getState(), 'notesPanel');
        if (isNotesPanelOpen) {
          dispatch(actions.closeElement('notesPanel'));
        }

        const isRedactionPanelOpen = selectors.isElementOpen(getState(), 'redactionPanel');
        if (isRedactionPanelOpen) {
          dispatch(actions.closeElement('redactionPanel'));
        }

        const isTextEditingPanelOpen = selectors.isElementOpen(getState(), 'textEditingPanel');
        if (isTextEditingPanelOpen) {
          dispatch(actions.closeElement('textEditingPanel'));
        }

        const isWv3dPropertiesPanelOpen = selectors.isElementOpen(getState(), 'wv3dPropertiesPanel');
        if (isWv3dPropertiesPanelOpen) {
          dispatch(actions.closeElement('wv3dPropertiesPanel'));
        }

        const isWatermarkPanelOpen = selectors.isElementOpen(getState(), 'watermarkPanel');
        if (isWatermarkPanelOpen) {
          dispatch(actions.closeElement('watermarkPanel'));
        }

        dispatch(actions.toggleElement('searchPanel'));
      },
      [ShortcutKeys[Shortcuts.ZOOM_IN]]: (e) => {
        e.preventDefault();
        const state = getState();
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(state);
        const isMultiViewerMode = selectors.isMultiViewerMode(state);
        zoomIn(isMultiViewerMode, activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.ZOOM_OUT]]: (e) => {
        e.preventDefault();
        const state = getState();
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(state);
        const isMultiViewerMode = selectors.isMultiViewerMode(state);
        zoomOut(isMultiViewerMode, activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.FIT_SCREEN_WIDTH]]: (e) => {
        e.preventDefault();
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (isMobile) {
          core.fitToWidth(activeDocumentViewerKey);
        } else {
          core.fitToPage(activeDocumentViewerKey);
        }
      },
      [ShortcutKeys[Shortcuts.PRINT]]: (e) => {
        e.preventDefault();

        print(
          dispatch,
          selectors.isEmbedPrintSupported(getState()),
          selectors.getSortStrategy(getState()),
          selectors.getColorMap(getState()),
        );
      },
      // TODO Compare: Intergrate panels with compare
      [ShortcutKeys[Shortcuts.BOOKMARK]]: (e) => {
        e.preventDefault();
        if (!selectors.isElementDisabled(getState(), DataElements.BOOKMARK_PANEL)) {
          dispatch(actions.openElement(DataElements.LEFT_PANEL));
          dispatch(actions.setActiveLeftPanel(DataElements.BOOKMARK_PANEL));

          const bookmarks = selectors.getBookmarks(getState());
          const currentPageIndex = core.getCurrentPage() - 1;
          // only add bookmark if page is not already bookmarked
          if (!bookmarks[currentPageIndex]) {
            dispatch(actions.addBookmark(currentPageIndex, i18next.t('message.untitled')));
          }
        }
      },
      [ShortcutKeys[Shortcuts.PREVIOUS_PAGE]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        e.preventDefault();

        setCurrentPage(core.getCurrentPage() - getNumberOfPagesToNavigate(), activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.NEXT_PAGE]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        e.preventDefault();

        setCurrentPage(core.getCurrentPage() + getNumberOfPagesToNavigate(), activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.UP]]: () => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (isFocusingElement() || core.isContinuousDisplayMode(activeDocumentViewerKey)) {
          return;
        }

        // do not call preventDefault else it will prevent scrolling
        const scrollViewElement = core.getScrollViewElement(activeDocumentViewerKey);
        const { scrollHeight, clientHeight } = scrollViewElement;
        const reachedTop = scrollViewElement.scrollTop === 0;

        if (reachedTop) {
          const currentPage = core.getCurrentPage(activeDocumentViewerKey);
          setCurrentPage(currentPage - getNumberOfPagesToNavigate(), activeDocumentViewerKey);

          // set the scrollbar to be at the bottom of the page only if the previous page is bigger than 1
          if (currentPage > 1) {
            scrollViewElement.scrollTop = scrollHeight - clientHeight;
          }
        }
      },
      [ShortcutKeys[Shortcuts.DOWN]]: () => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (isFocusingElement() || core.isContinuousDisplayMode(activeDocumentViewerKey)) {
          return;
        }

        // do not call preventDefault else it will prevent scrolling
        const scrollViewElement = core.getScrollViewElement(activeDocumentViewerKey);
        const { scrollTop, clientHeight, scrollHeight } = scrollViewElement;
        const reachedBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 1;
        if (reachedBottom) {
          setCurrentPage(core.getCurrentPage(activeDocumentViewerKey) + getNumberOfPagesToNavigate());
        }
      },
      [ShortcutKeys[Shortcuts.SWITCH_PAN]]: {
        keyup: this.createToolHotkeyHandler((e) => {
          e.preventDefault();

          setToolModeAndGroup(store, this.prevToolName);
          this.prevToolName = null;
        }),
        keydown: this.createToolHotkeyHandler((e) => {
          e.preventDefault();

          if (core.getToolMode().name !== 'Pan') {
            this.prevToolName = core.getToolMode().name;
            setToolModeAndGroup(store, 'Pan');
          }
        }),
      },
      [ShortcutKeys[Shortcuts.SELECT]]: (e) => {
        e.preventDefault();
        setToolModeAndGroup(store, 'AnnotationEdit', '');

        dispatch(
          actions.closeElements([
            'annotationPopup',
            'textPopup',
            'contextMenuPopup',
            'toolStylePopup',
            'annotationStylePopup',
            'signatureModal',
            'customStampModal',
            'printModal',
            'rubberStampOverlay',
            'contentEditModal',
            'filterModal',
          ]),
        );
      },
      [ShortcutKeys[Shortcuts.PAN]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'Pan');
      }),
      [ShortcutKeys[Shortcuts.ARROW]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateArrow');
      }),
      [ShortcutKeys[Shortcuts.CALLOUT]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateCallout');
      }),
      [ShortcutKeys[Shortcuts.ERASER]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationEraserTool');
      }),
      [ShortcutKeys[Shortcuts.FREEHAND]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateFreeHand');
      }),
      [ShortcutKeys[Shortcuts.IMAGE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateStamp');
      }),
      [ShortcutKeys[Shortcuts.LINE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateLine');
      }),
      [ShortcutKeys[Shortcuts.STICKY_NOTE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateSticky');
      }),
      [ShortcutKeys[Shortcuts.ELLIPSE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateEllipse');
      }),
      [ShortcutKeys[Shortcuts.RECTANGLE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateRectangle');
      }),
      [ShortcutKeys[Shortcuts.RUBBER_STAMP]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateRubberStamp');
      }),
      [ShortcutKeys[Shortcuts.FREETEXT]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateFreeText');
      }),
      [ShortcutKeys[Shortcuts.SIGNATURE]]: this.createToolHotkeyHandler(() => {
        const sigToolButton = document.querySelector('[data-element="signatureToolButton"] .Button');

        sigToolButton?.click();
      }),
      [ShortcutKeys[Shortcuts.SQUIGGLY]]: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(dispatch, window.Annotations.TextSquigglyAnnotation);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextSquiggly');
        }
      }),
      [ShortcutKeys[Shortcuts.HIGHLIGHT]]: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(dispatch, window.Annotations.TextHighlightAnnotation);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextHighlight');
        }
      }),
      [ShortcutKeys[Shortcuts.STRIKEOUT]]: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(dispatch, window.Annotations.TextStrikeoutAnnotation);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextStrikeout');
        }
      }),
      [ShortcutKeys[Shortcuts.UNDERLINE]]: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(dispatch, window.Annotations.TextUnderlineAnnotation);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextUnderline');
        }
      }),
    };
  },
  /**
   * Returns a function that will be used as a handler to a hotkey
   * @param {func} handler a function that only gets called when no textarea or input elements are focused
   * @ignore
   */
  createToolHotkeyHandler(handler) {
    const { getState } = this.store;

    return (...args) => {
      const openElements = selectors.getOpenElements(getState());
      const currentToolName = core.getToolMode().name;

      // disable changing tool when the signature overlay is opened.
      const isSignatureModalOpen =
        currentToolName === window.Core.Tools.ToolNames.SIGNATURE && openElements['signatureModal'];

      if (isFocusingElement() || isSignatureModalOpen) {
        return;
      }

      handler(...args);
    };
  },
  getShortcutKeyMap() {
    const { getState } = this.store;
    return selectors.getShortcutKeyMap(getState());
  },
  setShortcutKey(shortcut, key) {
    const { dispatch } = this.store;
    const shortcutKeyMap = { ...this.getShortcutKeyMap() };
    this.off(shortcutKeyMap[shortcut]);
    this.on(key, this.keyHandlerMap[ShortcutKeys[shortcut]]);
    shortcutKeyMap[shortcut] = key;
    dispatch(actions.setShortcutKeyMap(shortcutKeyMap));
  },
  hasConflict(shortcut, command) {
    const shortcutKeyMap = this.getShortcutKeyMap();
    const existingKeys = Object.keys(shortcutKeyMap).filter((item) => item !== shortcut).map((item) => shortcutKeyMap[item]);
    for (const key of existingKeys) {
      if (key === command || splitKey(key).includes(command)) {
        return true;
      }
    }
    return false;
  },
  enableShortcut(shortcut) {
    this.setShortcutKey(shortcut, this.getShortcutKeyMap()[shortcut]);
  },
  disableShortcut(shortcut) {
    this.off(this.getShortcutKeyMap()[shortcut]);
  }
};

export default Object.create(HotkeysManager);
