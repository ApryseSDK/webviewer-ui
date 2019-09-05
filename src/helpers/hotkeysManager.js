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

const HotkeysManager = {
  initialize(store) {
    // still allow hotkeys when focusing a textarea or an input
    hotkeys.filter = () => true;

    this.keyHandlerMap = this.createKeyHandlerMap(store);

    Object.keys(this.keyHandlerMap).forEach(key => {
      this.on(key, this.keyHandlerMap[key]);
    });
  },
  /**
   * Add an event handler for the given hotkey
   * This method is exposed in hotkeys.js so users can call instance.hotkeys.on(...)
   * @param {string} key a keyboard key or a tool name
   * @param {function} [handler] an optional function. If not passed, the default handler of the given key will be registered
   * @example
      instance.hotkeys.on('ctrl+d', e => {
        e.preventDefault();
        instance.closeDocument();
      });

      // this will register the default zoom in handler
      instance.hotkeys.on('ctrl+=, command+=');

      // this is equivalent to instance.hotkeys.on('escape');
      instance.hotkeys.on('AnnotationEdit');
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
    hotkeys(key, handler);
  },
  /**
   *
   * Remove an event handler for the given hotkey
   * This method is exposed in hotkeys.js so users can call instance.hotkeys.off(...)
   * @param {string} [key] an optional keyboard key or a tool name. If not passed, all handlers will be removed
   * @param {function} [handler] an optional function. If not passed, all handlers of the given key will be removed
   * @example
      // this will remove all handlers for ctrl = and command =
      instance.hotkeys.off('ctrl+=, command+=');

      // this is equivalent to instance.hotkeys.off('escape');
      instance.hotkeys.off('AnnotationEdit');
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
      pageup: e => {
        e.preventDefault();

        const currPageNumber = core.getCurrentPage();
        if (currPageNumber > 1) {
          core.setCurrentPage(currPageNumber - 1);
        }
      },
      pagedown: e => {
        e.preventDefault();

        const currPageNumber = core.getCurrentPage();
        if (currPageNumber < core.getTotalPages()) {
          core.setCurrentPage(currPageNumber + 1);
        }
      },
      escape: e => {
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
            'printModal',
            'searchOverlay',
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
      t: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, 'AnnotationCreateFreeText');
      }),
      s: this.createToolHotkeyHandler(() => {
        const sigToolButton = document.querySelector(
          '[data-element="signatureToolButton"]',
        );

        sigToolButton?.click();
      }),
      g: this.createToolHotkeyHandler(selectedText => {
        if (selectedText) {
          createTextAnnotationAndSelect(
            dispatch,
            window.Annotations.TextSquigglyAnnotation,
          );
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextSquiggly');
        }
      }),
      h: this.createToolHotkeyHandler(selectedText => {
        if (selectedText) {
          createTextAnnotationAndSelect(
            dispatch,
            window.Annotations.TextHighlightAnnotation,
          );
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextHighlight');
        }
      }),
      k: this.createToolHotkeyHandler(selectedText => {
        if (selectedText) {
          createTextAnnotationAndSelect(
            dispatch,
            window.Annotations.TextStrikeoutAnnotation,
          );
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextStrikeout');
        }
      }),
      u: this.createToolHotkeyHandler(selectedText => {
        if (selectedText) {
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
   */
  createToolHotkeyHandler(handler) {
    return (...args) => {
      if (!isFocusingElement()) {
        handler(core.getSelectedText(), ...args);
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
