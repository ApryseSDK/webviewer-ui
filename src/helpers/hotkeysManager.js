import hotkeys from 'hotkeys-js';

import core from 'core';
import openFilePicker from 'helpers/openFilePicker';
import copyText from 'helpers/copyText';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import { zoomIn, zoomOut } from 'helpers/zoom';
import print from 'helpers/print';
import createTextAnnotationAndSelect from 'helpers/createTextAnnotationAndSelect';
import { isMobile } from 'helpers/device';
import isFocusingElement from 'helpers/isFocusingElement';
import getNumberOfPagesToNavigate from 'helpers/getNumberOfPagesToNavigate';
import setCurrentPage from 'helpers/setCurrentPage';
import actions from 'actions';
import selectors from 'selectors';

const NOOP = () => {};

/**
 * Available hotkeys that can be passed to {@link WebViewerInstance.Hotkeys#on instance.hotkeys.on} or {@link WebViewerInstance.Hotkeys#off instance.hotkeys.off} as lowercase. Hotkeys that use the Ctrl key can also be activated by pressing the Command key. <br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> These strings are not static properties of this class. They are listed here only for the documentation purpose.
 * @name WebViewerInstance.Hotkeys.AvailableHotkeys
 * @enum {string}
 * @property {string} Ctrl_Shift_Equals Rotate the document clockwise (Ctrl+Shift+=).
 * @property {string} Ctrl_Shift_Minus Rotate the document counterclockwise (Ctrl+Shift+-)
 * @property {string} Ctrl_C Copy selected text or annotations
 * @property {string} Ctrl_V Paste text or annotations
 * @property {string} Ctrl_Z Undo an annotation change
 * @property {string} Ctrl_Y Redo an annotation change
 * @property {string} Ctrl_O Open the file picker
 * @property {string} Ctrl_F Open the search overlay
 * @property {string} Ctrl_Equals Zoom in (Ctrl+=)
 * @property {string} Ctrl_Minus Zoom out (Ctrl+-)
 * @property {string} Ctrl_0 Fit the document to the screen width in a small screen(< 640px), otherwise fit it to its original size
 * @property {string} Ctrl_P Print
 * @property {string} PageUp Go to the previous page
 * @property {string} PageDown Go to the next page
 * @property {string} Up Go to the previous page in single layout mode (ArrowUp)
 * @property {string} Down Go to the next page in single layout mode (ArrowDown)
 * @property {string} Space Hold to switch to Pan mode and release to return to previous tool
 * @property {string} Escape Select the AnnotationEdit tool
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

/**
 * A class which contains hotkeys APIs.<br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> You must NOT instantiate this yourself. Access instances of this class using {@link WebViewerInstance#hotkeys instance.hotkeys}
 * @namespace Hotkeys
 * @memberof WebViewerInstance
 */
const HotkeysManager = {
  initialize(store) {
    // still allow hotkeys when focusing a textarea or an input
    hotkeys.filter = () => true;
    this.keyHandlerMap = this.createKeyHandlerMap(store);
    this.prevToolName = null;
    Object.keys(this.keyHandlerMap).forEach(key => {
      this.on(key, this.keyHandlerMap[key]);
    });
  },
  /**
   * Add an event handler for the given hotkey
   * @method WebViewerInstance.Hotkeys#on
   * @param {string} key A keyboard key or a tool name. <br/>
   * If a hotkey is consisted of more than one key. Those keys should be connected using '+'.
   * @param {function|object} [handler] An optional argument <br/>
   * If it is undefined, the default handler of the given key will be registered <br/>
   * If it is an function, it will be called on key down <br/>
   * If it is an object, it should have the shape of { keydown: func1, keyup: func2 }. Func1 will be called on keydown while func2 will be called on keyup
   * @example
WebViewer(...)
  .then(function(instance) {
      // this will be called on keydown
      instance.hotkeys.on('ctrl+d, command+d', e => {
        e.preventDefault();
        instance.closeDocument();
      });

      instance.hotkeys.on('ctrl+g', {
        keydown: e => {
          console.log('ctrl+g is pressed!');
        },
        keyup: e => {
          console.log('ctrl+g is released!')
        },
      });

      // this will register the default zoom in handler
      instance.hotkeys.on('ctrl+=, command+=');

      // this is equivalent to instance.hotkeys.on('escape');
      instance.hotkeys.on('AnnotationEdit');
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
   * @method WebViewerInstance.Hotkeys#off
   * @param {string} [key] An optional keyboard key or a tool name. If not passed, all handlers will be removed
   * @param {function} [handler] An optional function. If not passed, all handlers of the given key will be removed
   * @example
WebViewer(...)
  .then(function(instance) {
      // this will remove all handlers for ctrl = and command =
      instance.hotkeys.off('ctrl+=, command+=');

      // this is equivalent to instance.hotkeys.off('escape');
      instance.hotkeys.off('AnnotationEdit');
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
      'ctrl+shift+=, command+shift+=': e => {
        e.preventDefault();
        core.rotateClockwise();
      },
      'ctrl+shift+-, command+shift+-': e => {
        e.preventDefault();
        core.rotateCounterClockwise();
      },
      'ctrl+c, command+c': () => {
        if (core.getSelectedText()) {
          copyText();
          dispatch(actions.closeElement('textPopup'));
        } else if (core.getSelectedAnnotations().length) {
          core.updateCopiedAnnotations();
        }
      },
      'ctrl+v, command+v': e => {
        if (!isFocusingElement()) {
          e.preventDefault();
          core.pasteCopiedAnnotations();
        }
      },
      'ctrl+z, command+z': e => {
        e.preventDefault();
        core.undo();
      },
      'ctrl+y, command+shift+z': e => {
        e.preventDefault();
        core.redo();
      },
      'ctrl+o, command+o': e => {
        e.preventDefault();
        openFilePicker();
      },
      'ctrl+f, command+f': e => {
        e.preventDefault();
        dispatch(actions.openElement('searchOverlay'));
      },
      'ctrl+=, command+=': e => {
        e.preventDefault();
        zoomIn();
      },
      'ctrl+-, command+-': e => {
        e.preventDefault();
        zoomOut();
      },
      'ctrl+0, command+0': e => {
        e.preventDefault();

        if (isMobile) {
          core.fitToWidth();
        } else {
          core.fitToPage();
        }
      },
      'ctrl+p, command+p': e => {
        e.preventDefault();

        print(dispatch, selectors.isEmbedPrintSupported(getState()));
      },
      enter: () => {
        if (document.activeElement.className.includes('Note')) {
          document.activeElement.click();
        } else if (document.activeElement.className === 'skip-to-document') {
          document.getElementById('pageText0').focus();
        } else if (document.activeElement.className === 'skip-to-notes') {
          dispatch(actions.openElement('notesPanel'));
          const noteEl = document.querySelector('.Note');
          if (noteEl) {
            noteEl.focus();
          }
        }
      },
      pageup: e => {
        e.preventDefault();

        setCurrentPage(core.getCurrentPage() - getNumberOfPagesToNavigate());
      },
      pagedown: e => {
        e.preventDefault();

        setCurrentPage(core.getCurrentPage() + getNumberOfPagesToNavigate());
      },
      up: () => {
        if (isFocusingElement() || core.isContinuousDisplayMode()) {
          return;
        }

        // do not call preventDefault else it will prevent scrolling
        const scrollViewElement = core.getScrollViewElement();
        const { scrollHeight, clientHeight } = scrollViewElement;
        const reachedTop = scrollViewElement.scrollTop === 0;
        if (reachedTop) {
          setCurrentPage(core.getCurrentPage() - getNumberOfPagesToNavigate());
          // set the scrollbar to be at the bottom of the page
          scrollViewElement.scrollTop = scrollHeight - clientHeight;
        }
      },
      down: () => {
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
      space: {
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
      escape: e => {
        e.preventDefault();
        setToolModeAndGroup(store, 'AnnotationEdit', '');

        const el = document.activeElement;
        if (el?.tabIndex === 0) {
          const hackEl = document.querySelector('.skip-to-hack');
          if (hackEl) {
            hackEl.focus();
            hackEl.blur();
          }
        }

        dispatch(
          actions.closeElements([
            'annotationPopup',
            'textPopup',
            'contextMenuPopup',
            'toolStylePopup',
            'annotationStylePopup',
            'signatureModal',
            'printModal',
            'searchOverlay',
            'stampOverlay',
          ]),
        );
      },
      p: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'Pan');
      }),
      a: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateArrow');
      }),
      c: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateCallout');
      }),
      e: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationEraserTool');
      }),
      f: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateFreeHand');
      }),
      i: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateStamp');
      }),
      l: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateLine');
      }),
      n: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateSticky');
      }),
      o: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateEllipse');
      }),
      r: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateRectangle');
      }),
      q: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateRubberStamp');
      }),
      t: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateFreeText');
      }),
      s: this.createToolHotkeyHandler(() => {
        const sigToolButton = document.querySelector(
          '[data-element="signatureToolButton"] .Button',
        );

        sigToolButton?.click();
      }),
      g: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(
            dispatch,
            window.Annotations.TextSquigglyAnnotation,
          );
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextSquiggly');
        }
      }),
      h: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(
            dispatch,
            window.Annotations.TextHighlightAnnotation,
          );
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextHighlight');
        }
      }),
      k: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(
            dispatch,
            window.Annotations.TextStrikeoutAnnotation,
          );
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextStrikeout');
        }
      }),
      u: this.createToolHotkeyHandler(() => {
        if (core.getSelectedText()) {
          createTextAnnotationAndSelect(
            dispatch,
            window.Annotations.TextUnderlineAnnotation,
          );
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
    return (...args) => {
      if (!isFocusingElement()) {
        handler(...args);
      }
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
