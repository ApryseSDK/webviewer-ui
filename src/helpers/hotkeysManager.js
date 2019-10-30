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
import actions from 'actions';
import selectors from 'selectors';

const NOOP = () => {};
/**
 * A class which contains hotkeys APIs.<br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> Hotkeys are listed in the <i>Members</i> section. They should be passed to {@link WebViewer.Hotkeys#on instance.hotkeys.on} or {@link WebViewer.Hotkeys#off instance.hotkeys.off} as lowercase. Hotkeys that use the Ctrl key can also be activated by pressing the Command key. <br />
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> You must NOT instantiate this yourself. Access instances of this class using {@link WebViewer#hotkeys instance.hotkeys}
 * @name WebViewer.Hotkeys
 * @class
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
   * @method WebViewer.Hotkeys#on
   * @param {string} key a keyboard key or a tool name
   * @param {function} [handler] an optional function. If not passed, the default handler of the given key will be registered
   * @example // 6.0 and after
WebViewer(...)
  .then(function(instance) {
      instance.hotkeys.on('ctrl+d, command+d', e => {
        e.preventDefault();
        instance.closeDocument();
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
   * @method WebViewer.Hotkeys#off
   * @param {string} [key] an optional keyboard key or a tool name. If not passed, all handlers will be removed
   * @param {function} [handler] an optional function. If not passed, all handlers of the given key will be removed
   * @example // 6.0 and after
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
      /**
       * Rotate the document clockwise
       * @name WebViewer.Hotkeys#Ctrl+Shift+=
       */
      'ctrl+shift+=, command+shift+=': e => {
        e.preventDefault();
        core.rotateClockwise();
      },
      /**
       * Rotate the document counterclockwise
       * @name WebViewer.Hotkeys#Ctrl+Shift+-
       */
      'ctrl+shift+-, command+shift+-': e => {
        e.preventDefault();
        core.rotateCounterClockwise();
      },
      /**
       * Copy selected text or annotations
       * @name WebViewer.Hotkeys#Ctrl+C
       */
      'ctrl+c, command+c': () => {
        if (core.getSelectedText()) {
          copyText();
          dispatch(actions.closeElement('textPopup'));
        } else if (core.getSelectedAnnotations().length) {
          core.updateCopiedAnnotations();
        }
      },
      /**
       * Paste text or annotations
       * @name WebViewer.Hotkeys#Ctrl+V
       */
      'ctrl+v, command+v': e => {
        if (!isFocusingElement()) {
          e.preventDefault();
          core.pasteCopiedAnnotations();
        }
      },
      /**
       * Undo an annotation change
       * @name WebViewer.Hotkeys#Ctrl+Z
       */
      'ctrl+z, command+z': e => {
        e.preventDefault();
        core.undo();
      },
      /**
       * Redo an annotation change
       * @name WebViewer.Hotkeys#Ctrl+Y
       */
      'ctrl+y, command+shift+z': e => {
        e.preventDefault();
        core.redo();
      },
      /**
       * Open the file picker
       * @name WebViewer.Hotkeys#Ctrl+O
       */
      'ctrl+o, command+o': e => {
        e.preventDefault();
        openFilePicker();
      },
      /**
       * Open the search overlay
       * @name WebViewer.Hotkeys#Ctrl+F
       */
      'ctrl+f, command+f': e => {
        e.preventDefault();
        dispatch(actions.openElement('searchOverlay'));
      },
      /**
       * Zoom in
       * @name WebViewer.Hotkeys#Ctrl+=
       */
      'ctrl+=, command+=': e => {
        e.preventDefault();
        zoomIn();
      },
      /**
       * Zoom out
       * @name WebViewer.Hotkeys#Ctrl+-
       */
      'ctrl+-, command+-': e => {
        e.preventDefault();
        zoomOut();
      },
      /**
       * Fit the document to the screen width in a small screen(< 640px), otherwise fit it to its original size
       * @name WebViewer.Hotkeys#Ctrl+0
       */
      'ctrl+0, command+0': e => {
        e.preventDefault();

        if (isMobile) {
          core.fitToWidth();
        } else {
          core.fitToPage();
        }
      },
      /**
       * Print
       * @name WebViewer.Hotkeys#Ctrl+P
       */
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
      /**
       * Go to the previous page
       * @name WebViewer.Hotkeys#PageUp
       */
      pageup: e => {
        e.preventDefault();

        const currPageNumber = core.getCurrentPage();
        if (currPageNumber > 1) {
          core.setCurrentPage(currPageNumber - 1);
        }
      },
      /**
       * Go to the next page
       * @name WebViewer.Hotkeys#PageDown
       */
      pagedown: e => {
        e.preventDefault();

        const currPageNumber = core.getCurrentPage();
        if (currPageNumber < core.getTotalPages()) {
          core.setCurrentPage(currPageNumber + 1);
        }
      },
      /**
       * Hold to switch to Pan mode and release to return to previous tool
       * @name WebViewer.Hotkeys#Space
       */
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
      /**
       * Select the AnnotationEdit tool
       * @name WebViewer.Hotkeys#Escape
       */
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
          ]),
        );
      },
      /**
       * Select the Pan tool
       * @name WebViewer.Hotkeys#P
       */
      p: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'Pan');
      }),
      /**
       * Select the AnnotationCreateArrow tool
       * @name WebViewer.Hotkeys#A
       */
      a: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateArrow');
      }),
      /**
       * Select the AnnotationCreateCallout tool
       * @name WebViewer.Hotkeys#C
       */
      c: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateCallout');
      }),
      /**
       * Select the AnnotationEraserTool tool
       * @name WebViewer.Hotkeys#E
       */
      e: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationEraserTool');
      }),
      /**
       * Select the AnnotationCreateFreeHand tool
       * @name WebViewer.Hotkeys#F
       */
      f: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateFreeHand');
      }),
      /**
       * Select the AnnotationCreateStamp tool
       * @name WebViewer.Hotkeys#I
       */
      i: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateStamp');
      }),
      /**
       * Select the AnnotationCreateLine tool
       * @name WebViewer.Hotkeys#L
       */
      l: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateLine');
      }),
      /**
       * Select the AnnotationCreateSticky tool
       * @name WebViewer.Hotkeys#N
       */
      n: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateSticky');
      }),
      /**
       * Select the AnnotationCreateEllipse tool
       * @name WebViewer.Hotkeys#O
       */
      o: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateEllipse');
      }),
      /**
       * Select the AnnotationCreateRectangle tool
       * @name WebViewer.Hotkeys#R
       */
      r: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateRectangle');
      }),
      /**
       * Select the AnnotationCreateFreeText tool
       * @name WebViewer.Hotkeys#T
       */
      t: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateFreeText');
      }),
      /**
       * Open the signature modal or the overlay
       * @name WebViewer.Hotkeys#S
       */
      s: this.createToolHotkeyHandler(() => {
        const sigToolButton = document.querySelector(
          '[data-element="signatureToolButton"]',
        );

        sigToolButton?.click();
      }),
      /**
       * Select the AnnotationCreateTextSquiggly tool
       * @name WebViewer.Hotkeys#G
       */
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
      /**
       * Select the AnnotationCreateTextHighlight tool
       * @name WebViewer.Hotkeys#H
       */
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
      /**
       * Select the AnnotationCreateTextStrikeout tool
       * @name WebViewer.Hotkeys#K
       */
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
      /**
       * Select the AnnotationCreateTextUnderline tool
       * @name WebViewer.Hotkeys#U
       */
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
    };

    return map[toolName];
  },
};

export default Object.create(HotkeysManager);
