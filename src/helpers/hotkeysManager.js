import hotkeys from 'hotkeys-js';
/* eslint-disable custom/use-core-hook-in-components */
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
import getRootNode from 'helpers/getRootNode';
import FocusStackManager from 'helpers/focusStackManager';
import { ITEM_RENDER_PREFIXES } from 'src/constants/customizationVariables';
import { panelNames } from 'src/constants/panel';
import {
  getViewOnlyShortcuts,
  keyMap,
  Keys,
  ShortcutKeys,
  Shortcuts,
  splitKey,
  ToolNameHotkeyMap
} from './hotkeysUtils';

const NOOP = () => { };

export const defaultHotkeysScope = 'viewer';

/**
 * A class which contains hotkeys APIs.<br/><br/>
 * <span style="color: red; font-size: 1.2em; font-weight: bold">⚠</span> You must NOT instantiate this yourself. Access instances of this class using {@link UI.hotkeys instance.UI.hotkeys}
 * @class UI.Hotkeys
 * @memberof UI
 */
const HotkeysManager = {
  /**
   * A map of hotkeys and whether they are currently active
   * @name UI.Hotkeys.activeHotkeysMap
   * @type {Object<string, boolean>}
   * @example this.activeHotkeysMap[Keys.CTRL_C] = true;
   * @ignore
   */
  activeHotkeysMap: {},
  previousActiveHotkeysMap: {},
  initialize(store) {
    // still allow hotkeys when focusing a textarea or an input
    hotkeys.filter = () => true;
    this.store = store;
    this.keyHandlerMap = this.createKeyHandlerMap();
    this.previousKeyHandlerMap = this.keyHandlerMap;
    this.prevToolName = null;
    const shortcutKeyMap = this.getShortcutKeyMap();
    Object.keys(shortcutKeyMap).forEach((shortcut) => {
      this.on(shortcutKeyMap[shortcut], this.keyHandlerMap[ShortcutKeys[shortcut]]);
    });
    this.didInitializeAllKeys = true;
    hotkeys.setScope(defaultHotkeysScope);
    this.formBuilderDisabledKeys = {};
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

    if (key && typeof key === 'string') {
      key = key.toLocaleLowerCase();
    }

    if (!handler) {
      handler = this.getDefaultKeyHandler(key);
    }

    // If no key is given, enable all hotkeys
    if ((!key || !handler) && !this.didInitializeAllKeys) {
      this.keyHandlerMap = this.createKeyHandlerMap();
      this.prevToolName = null;
      Object.keys(this.keyHandlerMap).forEach((_key) => {
        // Check if the "key" has already been initialized
        if (!this.activeHotkeysMap[_key]) {
          this.enableHotkey(_key, this.keyHandlerMap[_key]);
        }
      });
      this.didInitializeAllKeys = true;
    }

    // when key is undefined we need to set all keys to true
    if (!key) {
      for (const property in Keys) {
        this.activeHotkeysMap[Keys[property]] = true;
      }
    } else {
      this.activeHotkeysMap[key.toLocaleLowerCase()] = true;
    }

    if (!key || !handler) {
      return;
    }

    this.enableHotkey(key, handler);
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
    this.previousActiveHotkeysMap = { ...this.activeHotkeysMap };
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
        this.activeHotkeysMap[Keys[property]] = false;
      }
      this.didInitializeAllKeys = false;
    } else {
      this.activeHotkeysMap[key.toLocaleLowerCase()] = false;
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
      return this.activeHotkeysMap[hotkeyName];
    }
    return true;
  },
  enableHotkey(_key, _handler) {
    // https://github.com/jaywcjlove/hotkeys#defining-shortcuts
    const { keyup = NOOP, keydown = _handler } = _handler;
    hotkeys(_key, { keyup: true, scope: defaultHotkeysScope }, (e) => {
      // Preventing the hotkey from being called multiple times or in the wrong viewer
      // when using the web component version of webviewer.
      // the escape key is special, it can be triggered with the wrong target if for example we
      // add a signature from the modal and then choose to not apply it, so we whitelist it
      // Same with the close shortcut it can be triggered no matter where the focus is since it is kind of like an escape
      const isEscape = e.key === 'Escape' || e.key === ShortcutKeys[Shortcuts.CLOSE];
      const shadowRoot = e.currentTarget.activeElement?.shadowRoot;
      const calledFromCurrentViewer = shadowRoot === getRootNode();
      if (calledFromCurrentViewer || !window.isApryseWebViewerWebComponent || isEscape) {
        if (e.type === 'keyup') {
          keyup(e);
        }
        if (e.type === 'keydown') {
          keydown(e);
        }
      }
    });
  },
  getDefaultKeyHandler(key) {
    let defaultKeyHandler;
    const isComposedShortcut = key?.includes('+');
    if (isComposedShortcut) {
      const correspondShortcut = Object.keys(this.keyHandlerMap).find((shortcut) => shortcut?.includes(key));
      if (correspondShortcut) {
        defaultKeyHandler = this.keyHandlerMap[correspondShortcut];
      }
    } else {
      defaultKeyHandler = this.keyHandlerMap[key];
    }

    return defaultKeyHandler;
  },
  createKeyHandlerMap() {
    const store = this.store;
    const { dispatch, getState } = store;
    const { ToolNames } = window.Core.Tools;

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
      [ShortcutKeys[Shortcuts.NUMPAD_ROTATE_CLOCKWISE]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        e.preventDefault();
        core.rotateClockwise(activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.NUMPAD_ROTATE_COUNTER_CLOCKWISE]]: (e) => {
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
      [ShortcutKeys[Shortcuts.NUMPAD_ZOOM_IN]]: (e) => {
        e.preventDefault();
        const state = getState();
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(state);
        const isMultiViewerMode = selectors.isMultiViewerMode(state);
        zoomIn(isMultiViewerMode, activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.NUMPAD_ZOOM_OUT]]: (e) => {
        e.preventDefault();
        const state = getState();
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(state);
        const isMultiViewerMode = selectors.isMultiViewerMode(state);
        zoomOut(isMultiViewerMode, activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.SET_HEADER_FOCUS]]: (e) => {
        e.preventDefault();
        const state = getState();
        const isModularUI = selectors.getFeatureFlags(state)?.customizableUI;
        const activeHeaders = selectors.getActiveHeaders(state);
        const firstHeaderDataElement = isModularUI ?
          activeHeaders[0]?.dataElement : // first modular UI header data element
          'header'; // legacy header data element
        const firstHeaderElement = getRootNode().querySelector(`[data-element="${firstHeaderDataElement}"]`);
        firstHeaderElement?.focus();
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
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        print(
          dispatch,
          selectors.useClientSidePrint(getState()),
          selectors.isEmbedPrintSupported(getState()),
          selectors.getSortStrategy(getState()),
          selectors.getColorMap(getState()),
          { documentViewerKey: activeDocumentViewerKey }
        );
      },
      // TODO Compare: Intergrate panels with compare
      [ShortcutKeys[Shortcuts.BOOKMARK]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        e.preventDefault();
        if (!selectors.isElementDisabled(getState(), DataElements.BOOKMARK_PANEL)) {
          const isModularUI = selectors.getFeatureFlags(getState())?.customizableUI;
          if (isModularUI) {
            dispatch(actions.openElement(panelNames.TABS));
            dispatch(actions.setActiveTabInPanel(DataElements.BOOKMARK_PANEL, panelNames.TABS));
          } else {
            dispatch(actions.openElement(DataElements.LEFT_PANEL));
            dispatch(actions.setActiveLeftPanel(DataElements.BOOKMARK_PANEL));
          }
          const bookmarks = core.getUserBookmarks(activeDocumentViewerKey);
          const currentPageIndex = core.getCurrentPage(activeDocumentViewerKey) - 1;
          // only add bookmark if page is not already bookmarked
          if (!bookmarks[currentPageIndex]) {
            core.addUserBookmark(currentPageIndex, i18next.t('message.untitled'), activeDocumentViewerKey);
          }
        }
      },
      [ShortcutKeys[Shortcuts.PREVIOUS_PAGE]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        e.preventDefault();

        const currentPage = core.getCurrentPage(activeDocumentViewerKey);
        const numberOfPagesToNavigate = getNumberOfPagesToNavigate();
        const newPage = currentPage - numberOfPagesToNavigate;
        setCurrentPage(newPage, activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.NEXT_PAGE]]: (e) => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        e.preventDefault();

        const currentPage = core.getCurrentPage(activeDocumentViewerKey);
        const numberOfPagesToNavigate = getNumberOfPagesToNavigate();
        const newPage = currentPage + numberOfPagesToNavigate;
        setCurrentPage(newPage, activeDocumentViewerKey);
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

        const stack = FocusStackManager.getStack();
        // If there is FocusStackManager stack and it keyboard
        // interaction, we will block closing elements.
        if (stack.length) {
          return;
        }

        setToolModeAndGroup(store, 'AnnotationEdit', '');

        const rubberStampPanelInFlyout = selectors.getIsPanelInFlyout(getState(), ITEM_RENDER_PREFIXES.RUBBER_STAMP_PANEL);
        const signatureListPanelInFlyout = selectors.getIsPanelInFlyout(getState(), ITEM_RENDER_PREFIXES.SIGNATURE_LIST_PANEL);

        dispatch(
          actions.closeElements([
            DataElements.ANNOTATION_POPUP,
            DataElements.TEXT_POPUP,
            DataElements.CONTEXT_MENU_POPUP,
            'toolStylePopup',
            DataElements.ANNOTATION_STYLE_POPUP,
            DataElements.SIGNATURE_MODAL,
            'customStampModal',
            DataElements.PRINT_MODAL,
            'rubberStampOverlay',
            DataElements.FILTER_MODAL,
            DataElements.SIGNATURE_LIST_PANEL,
            DataElements.RUBBER_STAMP_PANEL,
            rubberStampPanelInFlyout?.dataElement,
            signatureListPanelInFlyout?.dataElement,
          ]),
        );
      },
      [ShortcutKeys[Shortcuts.PAN]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.PAN);
      }),
      [ShortcutKeys[Shortcuts.ARROW]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.ARROW);
      }),
      [ShortcutKeys[Shortcuts.CALLOUT]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.CALLOUT);
      }),
      [ShortcutKeys[Shortcuts.ERASER]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.ERASER);
      }),
      [ShortcutKeys[Shortcuts.FREEHAND]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.FREEHAND);
      }),
      [ShortcutKeys[Shortcuts.IMAGE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.STAMP);
      }),
      [ShortcutKeys[Shortcuts.LINE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.LINE);
      }),
      [ShortcutKeys[Shortcuts.STICKY_NOTE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.STICKY);
      }),
      [ShortcutKeys[Shortcuts.ELLIPSE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.ELLIPSE);
      }),
      [ShortcutKeys[Shortcuts.RECTANGLE]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.RECTANGLE);
      }),
      [ShortcutKeys[Shortcuts.RUBBER_STAMP]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.RUBBER_STAMP);
      }),
      [ShortcutKeys[Shortcuts.FREETEXT]]: this.createToolHotkeyHandler(() => {
        setToolModeAndGroup(store, ToolNames.FREETEXT);
      }),
      [ShortcutKeys[Shortcuts.SIGNATURE]]: this.createToolHotkeyHandler(() => {
        const state = getState();
        const isCustomizableUI = state.featureFlags.customizableUI;
        if (isCustomizableUI) {
          setToolModeAndGroup(store, ToolNames.SIGNATURE);
          return;
        }
        dispatch(actions.setToolbarGroup('toolbarGroup-FillAndSign', false));
        const sigToolButton = getRootNode().querySelector('[data-element="signatureToolGroupButton"] .Button');
        sigToolButton?.click();
        const sigModalButton = getRootNode().querySelector('.signature-row-content');
        sigModalButton?.click();
      }),
      [ShortcutKeys[Shortcuts.SQUIGGLY]]: this.createToolHotkeyHandler(() => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (core.getSelectedText(activeDocumentViewerKey)) {
          createTextAnnotationAndSelect(dispatch, window.Core.Annotations.TextSquigglyAnnotation, activeDocumentViewerKey);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextSquiggly');
        }
      }),
      [ShortcutKeys[Shortcuts.HIGHLIGHT]]: this.createToolHotkeyHandler(() => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (core.getSelectedText(activeDocumentViewerKey)) {
          createTextAnnotationAndSelect(dispatch, window.Core.Annotations.TextHighlightAnnotation, activeDocumentViewerKey);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextHighlight');
        }
      }),
      [ShortcutKeys[Shortcuts.STRIKEOUT]]: this.createToolHotkeyHandler(() => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (core.getSelectedText(activeDocumentViewerKey)) {
          createTextAnnotationAndSelect(dispatch, window.Core.Annotations.TextStrikeoutAnnotation, activeDocumentViewerKey);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextStrikeout');
        }
      }),
      [ShortcutKeys[Shortcuts.UNDERLINE]]: this.createToolHotkeyHandler(() => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (core.getSelectedText(activeDocumentViewerKey)) {
          createTextAnnotationAndSelect(dispatch, window.Core.Annotations.TextUnderlineAnnotation, activeDocumentViewerKey);
        } else {
          setToolModeAndGroup(store, 'AnnotationCreateTextUnderline');
        }
      }),
      [ShortcutKeys[Shortcuts.HOME]]: () => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (isFocusingElement() || core.isContinuousDisplayMode(activeDocumentViewerKey)) {
          return;
        }
        setCurrentPage(1, activeDocumentViewerKey);
      },
      [ShortcutKeys[Shortcuts.END]]: this.createToolHotkeyHandler(() => {
        const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
        if (isFocusingElement() || core.isContinuousDisplayMode(activeDocumentViewerKey)) {
          return;
        }
        const pageCount = selectors.getTotalPages(getState());
        setCurrentPage(pageCount, activeDocumentViewerKey);
      }),
      [ShortcutKeys[Shortcuts.CLOSE]]: () => {
        if (closeToolTipFunc) {
          closeToolTipFunc();
          closeToolTipFunc = null;
        }
      },
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
    if (!core.getAnnotationManager().isReadOnlyModeEnabled()) {
      this.on(key, this.keyHandlerMap[ShortcutKeys[shortcut]]);
    }
    shortcutKeyMap[shortcut] = key;
    dispatch(actions.setShortcutKeyMap(shortcutKeyMap));
  },
  /**
   * @ignore
   * Checks whether a command is being used by any shortcut other than the one specified
   * @param {string} shortcut The shortcut string, e.g. Shortcuts.COPY
   * @param {string} command The keyboard command, e.g. 'ctrl+c'
   * @returns {boolean} Whether the command is being used by any other shortcut
   */
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
  },
  /**
   * @name UI.Hotkeys.restoreHotkeys
   * Restores the hotkeys to default and disables previously unbinded hotkeys.
   * @ignore
   */
  restoreHotkeys() {
    const disabledHotkeys = { ...this.previousActiveHotkeysMap };
    this.on();
    for (const property in Keys) {
      if (disabledHotkeys[Keys[property]] === false) {
        this.off(Keys[property]);
      }
    }
  },

  setViewOnlyMode(enabled) {
    const currentShortcutKeyMap = this.getShortcutKeyMap();

    if (enabled) {
      // Capture the current default mode state
      this.originalActiveHotkeysMap = { ...this.activeHotkeysMap };

      this.preViewOnlyEnabledShortcuts = {};

      Object.keys(currentShortcutKeyMap).forEach((shortcut) => {
        const key = currentShortcutKeyMap[shortcut];
        if (key) {
          const keyLower = key.toLowerCase();

          // For concatenated keys (e.g., "ctrl+f, command+f"), check if any individual key is disabled
          let isEnabled = true;
          if (keyLower.includes(', ')) {
            const individualKeys = splitKey(keyLower);
            // If any individual key is disabled, consider the whole shortcut disabled
            isEnabled = !individualKeys.some((individualKey) => this.originalActiveHotkeysMap[individualKey] === false);
          } else {
            isEnabled = this.originalActiveHotkeysMap[keyLower] !== false;
          }

          this.preViewOnlyEnabledShortcuts[shortcut] = isEnabled;
        }
      });

      this.off();

      getViewOnlyShortcuts().forEach((shortcut) => {
        const key = currentShortcutKeyMap[shortcut];
        if (key && this.preViewOnlyEnabledShortcuts[shortcut]) {
          const handler = this.keyHandlerMap[ShortcutKeys[shortcut]];
          if (handler) {
            this.on(key, handler);
          }
        }
      });
    } else {
      this.off();

      // Restore the original state from default mode
      if (this.originalActiveHotkeysMap) {
        for (const key in this.activeHotkeysMap) {
          delete this.activeHotkeysMap[key];
        }
        Object.assign(this.activeHotkeysMap, this.originalActiveHotkeysMap);
      }

      // Re-enable all shortcuts that were enabled in the original default mode
      Object.keys(currentShortcutKeyMap).forEach((shortcut) => {
        const key = currentShortcutKeyMap[shortcut];
        const wasEnabledInOriginalState = this.preViewOnlyEnabledShortcuts?.[shortcut];

        if (key && wasEnabledInOriginalState !== false) {
          const handler = this.keyHandlerMap[ShortcutKeys[shortcut]];
          if (handler) {
            this.on(key, handler);
          }
        }
      });

      delete this.preViewOnlyEnabledShortcuts;
      delete this.originalActiveHotkeysMap;
    }
  }
};

export let closeToolTipFunc;

export const setCloseToolTipFunc = (func) => {
  closeToolTipFunc = func;
};

export const getCloseToolTipFunc = () => closeToolTipFunc;

export default Object.create(HotkeysManager);