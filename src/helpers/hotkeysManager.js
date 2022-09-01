import hotkeys from 'hotkeys-js';

import core from 'core';
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

// prettier-ignore
const keyMap = {
  "arrow":                  "A",
  "callout":                "C",
  "copy":                   "Control+C",
  "delete":                 "Delete",
  "ellipse":                "O",
  "eraser":                 "E",
  "freehand":               "F",
  "freetext":               "T",
  "highlight":              "H",
  "line":                   "L",
  "pan":                    "P",
  "rectangle":              "R",
  "rotateClockwise":        "Control+Shift+=",
  "rotateCounterClockwise": "Control+Shift+-",
  "select":                 "Escape",
  "signature":              "S",
  "squiggly":               "G",
  "image":                  "I",
  "redo":                   "Control+Shift+Z",
  "undo":                   "Control+Z",
  "stickyNote":             "N",
  "strikeout":              "K",
  "underline":              "U",
  "zoomIn":                 "Control+=",
  "zoomOut":                "Control+-",
  "richText.bold":          "Control+B",
  "richText.italic":        "Control+I",
  "richText.underline":     "Control+U",
  "richText.strikeout":     "Control+K",
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
 * @property {string} PAGE_UP Go to the previous page
 * @property {string} PAGE_DOWN Go to the next page
 * @property {string} UP Go to the previous page in single layout mode (ArrowUp)
 * @property {string} DOWN Go to the next page in single layout mode (ArrowDown)
 * @property {string} SPACE Hold to switch to Pan mode and release to return to previous tool
 * @property {string} ESCAPE Select the AnnotationEdit tool
 * @property {string} P Select the Pan tool
 * @property {string} A Select the AnnotationCreateArrow tool
 * @property {string} C Select the AnnotationCreateCallout tool
 * @property {string} E Select the AnnotationEraserTool tool
 * @property {string} F Select the AnnotationCreateFreeHand tool
 * @property {string} I Select the AnnotationCreateStamp tool
 * @property {string} L Select the AnnotationCreateLine tool
 * @property {string} N Select the AnnotationCreateSticky tool
 * @property {string} O Select the AnnotationCreateEllipse tool
 * @property {string} R Select the AnnotationCreateRectangle tool
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
  ENTER: 'enter',
  PAGE_UP: 'pageup',
  PAGE_DOWN: 'pagedown',
  UP: 'up',
  DOWN: 'down',
  SPACE: 'space',
  ESCAPE: 'escape',
  P: 'shift+p',
  A: 'shift+a',
  C: 'shift+c',
  E: 'shift+e',
  F: 'shift+f',
  I: 'shift+i',
  L: 'shift+l',
  N: 'shift+n',
  O: 'shift+o',
  R: 'shift+r',
  Q: 'shift+q',
  T: 'shift+t',
  S: 'shift+s',
  G: 'shift+g',
  H: 'shift+h',
  K: 'shift+k',
  U: 'shift+u',
};

export function concatKeys(...keys) {
  return keys.join(', ');
}

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
    this.keyHandlerMap = this.createKeyHandlerMap(store);
    this.prevToolName = null;
    Object.keys(this.keyHandlerMap).forEach(key => {
      this.on(key, this.keyHandlerMap[key]);
    });
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
      key = this.getHotkeyByToolName(key);
    }

    if (!handler) {
      handler = this.keyHandlerMap[key];
    }

    if (!key || !handler) {
      return;
    }

    // https://github.com/jaywcjlove/hotkeys#defining-shortcuts
    const { keyup = NOOP, keydown = handler } = handler;
    hotkeys(key, { keyup: true }, e => {
      if (e.type === 'keyup') {
        keyup(e);
      }
      if (e.type === 'keydown') {
        keydown(e);
      }
    });
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
      key = this.getHotkeyByToolName(key);

      // need to return here otherwise all the handlers will be removed
      // if the tool name doesn't have a corresponding hotkey
      if (!key) {
        return;
      }
    }

    // https://github.com/jaywcjlove/hotkeys#unbind
    hotkeys.unbind(key, handler);
  },
  createKeyHandlerMap(store) {
    const { dispatch, getState } = store;

    return {
      [`${Keys.CTRL_SHIFT_EQUAL}, ${Keys.COMMAND_SHIFT_EQUAL}`]: e => {
        e.preventDefault();
        core.rotateClockwise();
      },
      [`${Keys.CTRL_SHIFT_MINUS}, ${Keys.COMMAND_SHIFT_MINUS}`]: e => {
        e.preventDefault();
        core.rotateCounterClockwise();
      },
      [`${Keys.CTRL_C}, ${Keys.COMMAND_C}`]: () => {
        if (core.getSelectedText()) {
          copyText();
          dispatch(actions.closeElement('textPopup'));
        } else if (core.getSelectedAnnotations().length) {
          core.updateCopiedAnnotations();
        }
      },
      [`${Keys.CTRL_V}, ${Keys.COMMAND_V}`]: e => {
        if (!isFocusingElement()) {
          e.preventDefault();
          core.pasteCopiedAnnotations();
        }
      },
      [`${Keys.CTRL_Z}, ${Keys.COMMAND_Z}`]: e => {
        if (!isFocusingElement()) {
          e.preventDefault();
          core.undo();
        }
      },
      [`${Keys.CTRL_Y}, ${Keys.COMMAND_SHIFT_Z}`]: e => {
        if (!isFocusingElement()) {
          e.preventDefault();
          core.redo();
        }
      },
      [`${Keys.CTRL_O}, ${Keys.COMMAND_O}`]: e => {
        e.preventDefault();
        openFilePicker();
      },
      [concatKeys(Keys.CTRL_F, Keys.COMMAND_F)]: e => {
        e.preventDefault();

        const isNotesPanelOpen = selectors.isElementOpen(getState(), 'notesPanel');
        if (isNotesPanelOpen) {
          dispatch(actions.closeElement('notesPanel'));
        }

        dispatch(actions.openElement('searchPanel'));
      },
      [`${Keys.CTRL_EQUAL}, ${Keys.COMMAND_EQUAL}`]: e => {
        e.preventDefault();
        zoomIn();
      },
      [`${Keys.CTRL_MINUS}, ${Keys.COMMAND_MINUS}`]: e => {
        e.preventDefault();
        zoomOut();
      },
      [`${Keys.CTRL_0}, ${Keys.COMMAND_0}`]: e => {
        e.preventDefault();

        if (isMobile) {
          core.fitToWidth();
        } else {
          core.fitToPage();
        }
      },
      [concatKeys(Keys.CTRL_P, Keys.COMMAND_P)]: e => {
        e.preventDefault();

        print(dispatch, selectors.isEmbedPrintSupported(getState()), selectors.getSortStrategy(getState()), selectors.getColorMap(getState()));
      },
      [`${Keys.PAGE_UP}`]: e => {
        e.preventDefault();

        setCurrentPage(core.getCurrentPage() - getNumberOfPagesToNavigate());
      },
      [`${Keys.PAGE_DOWN}`]: e => {
        e.preventDefault();

        setCurrentPage(core.getCurrentPage() + getNumberOfPagesToNavigate());
      },
      [`${Keys.UP}`]: () => {
        if (isFocusingElement() || core.isContinuousDisplayMode()) {
          return;
        }

        // do not call preventDefault else it will prevent scrolling
        const scrollViewElement = core.getScrollViewElement();
        const { scrollHeight, clientHeight } = scrollViewElement;
        const reachedTop = scrollViewElement.scrollTop === 0;

        if (reachedTop) {
          const currentPage = core.getCurrentPage();
          setCurrentPage(currentPage - getNumberOfPagesToNavigate());

          // set the scrollbar to be at the bottom of the page only if the previous page is bigger than 1
          if (currentPage > 1) {
            scrollViewElement.scrollTop = scrollHeight - clientHeight;
          }
        }
      },
      [`${Keys.DOWN}`]: () => {
        if (isFocusingElement() || core.isContinuousDisplayMode()) {
          return;
        }

        // do not call preventDefault else it will prevent scrolling
        const scrollViewElement = core.getScrollViewElement();
        const { scrollTop, clientHeight, scrollHeight } = scrollViewElement;
        const reachedBottom = Math.abs(scrollTop + clientHeight - scrollHeight) <= 1;
        if (reachedBottom) {
          setCurrentPage(core.getCurrentPage() + getNumberOfPagesToNavigate());
        }
      },
      [`${Keys.SPACE}`]: {
        keyup: this.createToolHotkeyHandler(e => {
          e.preventDefault();

          setToolModeAndGroup(store, this.prevToolName);
          this.prevToolName = null;
        }),
        keydown: this.createToolHotkeyHandler(e => {
          e.preventDefault();

          if (core.getToolMode().name !== 'Pan') {
            this.prevToolName = core.getToolMode().name;
            setToolModeAndGroup(store, 'Pan');
          }
        }),
      },
      [`${Keys.ESCAPE}`]: e => {
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
          ])
        );
      },
      [`${Keys.P}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'Pan');
      }),
      [`${Keys.A}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateArrow');
      }),
      [`${Keys.C}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateCallout');
      }),
      [`${Keys.E}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationEraserTool');
      }),
      [`${Keys.F}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateFreeHand');
      }),
      [`${Keys.I}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateStamp');
      }),
      [`${Keys.L}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateLine');
      }),
      [`${Keys.N}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateSticky');
      }),
      [`${Keys.O}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateEllipse');
      }),
      [`${Keys.R}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateRectangle');
      }),
      [`${Keys.Q}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateRubberStamp');
      }),
      [`${Keys.T}`]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateFreeText');
      }),
      [`${Keys.S}`]: this.createToolHotkeyHandler(() => {
        const sigToolButton = document.querySelector(
          '[data-element="signatureToolButton"] .Button'
        );

        sigToolButton?.click();
      }),
      [`${Keys.G}`]: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(dispatch, window.Annotations.TextSquigglyAnnotation);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextSquiggly');
        }
      }),
      [`${Keys.H}`]: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(dispatch, window.Annotations.TextHighlightAnnotation);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextHighlight');
        }
      }),
      [`${Keys.K}`]: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(dispatch, window.Annotations.TextStrikeoutAnnotation);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextStrikeout');
        }
      }),
      [`${Keys.U}`]: this.createToolHotkeyHandler(() => {
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
      const isSignatureModalOpen = currentToolName === window.Core.Tools.ToolNames.SIGNATURE && openElements['signatureModal'];

      if (isFocusingElement() || isSignatureModalOpen) {
        return;
      }

      handler(...args);
    };
  },
  getHotkeyByToolName(toolName) {
    const map = {
      AnnotationEdit: 'escape',
      Pan: 'p',
      AnnotationCreateArrow: 'a',
      AnnotationCreateCallout: 'c',
      AnnotationEraserTool: 'e',
      AnnotationCreateFreeHand: 'f',
      AnnotationCreateStamp: 'i',
      AnnotationCreateLine: 'l',
      AnnotationCreateSticky: 'n',
      AnnotationCreateEllipse: 'o',
      AnnotationCreateRectangle: 'r',
      AnnotationCreateFreeText: 't',
      AnnotationCreateSignature: 's',
      AnnotationCreateTextSquiggly: 'g',
      AnnotationCreateTextHighlight: 'h',
      AnnotationCreateTextStrikeout: 'k',
      AnnotationCreateTextUnderline: 'u',
      AnnotationCreateRubberStamp: 'q',
    };

    return map[toolName];
  },
};

export default Object.create(HotkeysManager);
