import onContentEditModeStarted from './onContentEditModeStarted';
import hotkeys from 'hotkeys-js';
import selectors from 'selectors';
import core from 'core';
import actions from 'actions';
import hotkeysManager from 'helpers/hotkeysManager';
import { CONTENT_EDIT_SCOPE } from 'constants/contentEdit';
import DataElements from 'constants/dataElement';
import { Shortcuts } from 'helpers/hotkeysUtils';
import { createContentEditStyleBridgeHandler, resolveContentEditShortcutHandler } from 'helpers/contentEditHotkeys';

jest.mock('actions', () => ({
  setIsContentEditingEnabled: jest.fn((p) => ({ type: 'SET_IS_CONTENT_EDITING_ENABLED', payload: p })),
  setContentWorkersAsLoaded: jest.fn(() => ({ type: 'SET_CONTENT_WORKERS_AS_LOADED' })),
  disableElement: jest.fn((dataElement) => ({ type: 'DISABLE_ELEMENT', payload: { dataElement } })),
  openElement: jest.fn((dataElement) => ({ type: 'OPEN_ELEMENT', payload: { dataElement } })),
}));

jest.mock('hotkeys-js', () => {
  const fn = jest.fn();
  fn.unbind = jest.fn();
  fn.setScope = jest.fn();
  return fn;
});

jest.mock('selectors', () => ({
  getShortcutKeyMap: jest.fn(),
  getFeatureFlags: jest.fn(),
  isElementOpen: jest.fn(),
  getActiveDocumentViewerKey: jest.fn(),
  isContentEditingEnabled: jest.fn(),
}));

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
}));

jest.mock('helpers/hotkeysManager', () => ({
  __esModule: true,
  default: {
    keyHandlerMap: {},
    contentEditStyleHotkeyHandler: null,
    contentEditStyleHotkeyDocument: null,
  },
}));

jest.mock('helpers/contentEditHotkeys', () => ({
  createContentEditStyleBridgeHandler: jest.fn(),
  resolveContentEditShortcutHandler: jest.fn(),
}));

jest.mock('helpers/hotkeysUtils', () => {
  const Shortcuts = {
    CONTENT_EDIT_BOLD: 'contentEditBold',
    CONTENT_EDIT_STRIKEOUT: 'contentEditStrikeout',
  };

  return {
    Shortcuts,
    CONTENT_EDIT_SHORTCUTS: [
      Shortcuts.CONTENT_EDIT_BOLD,
      Shortcuts.CONTENT_EDIT_STRIKEOUT,
    ],
    ShortcutKeys: {
      [Shortcuts.CONTENT_EDIT_BOLD]: 'ctrl+b, command+b',
      [Shortcuts.CONTENT_EDIT_STRIKEOUT]: 'ctrl+k, command+k',
      BOOKMARK: 'ctrl+b, command+b',
    },
    getContentEditShortcutKeyMap: jest.fn(),
    resolveShortcutByKeyCombo: jest.fn(),
  };
});

describe('onContentEditModeStarted', () => {
  const dispatch = jest.fn();
  let ownerDocument;
  const store = { dispatch, getState: jest.fn(() => ({})) };

  beforeEach(() => {
    ownerDocument = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    selectors.getShortcutKeyMap.mockReturnValue({});
    selectors.getFeatureFlags.mockReturnValue({ customizableUI: true });
    selectors.isElementOpen.mockReturnValue(false);
    selectors.getActiveDocumentViewerKey.mockReturnValue(1);
    selectors.isContentEditingEnabled.mockReturnValue(true);

    core.getDocumentViewer.mockReturnValue({
      getViewerElement: () => ({ ownerDocument }),
    });

    const utils = jest.requireMock('helpers/hotkeysUtils');
    utils.getContentEditShortcutKeyMap.mockReturnValue({
      [Shortcuts.CONTENT_EDIT_BOLD]: 'ctrl+b, command+b',
      [Shortcuts.CONTENT_EDIT_STRIKEOUT]: 'ctrl+k, command+k',
    });
    utils.resolveShortcutByKeyCombo.mockImplementation((combo) => {
      if (combo === 'ctrl+b') {
        return Shortcuts.CONTENT_EDIT_BOLD;
      }
      if (combo === 'ctrl+k') {
        return Shortcuts.CONTENT_EDIT_STRIKEOUT;
      }
      return null;
    });

    resolveContentEditShortcutHandler.mockImplementation((shortcut) => {
      if (shortcut === Shortcuts.CONTENT_EDIT_BOLD || shortcut === Shortcuts.CONTENT_EDIT_STRIKEOUT) {
        return jest.fn();
      }
      return undefined;
    });

    createContentEditStyleBridgeHandler.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
    hotkeysManager.contentEditStyleHotkeyHandler = null;
    hotkeysManager.contentEditStyleHotkeyDocument = null;
  });

  it('binds resolved content edit shortcuts in content edit scope', () => {
    onContentEditModeStarted(dispatch, store)();

    expect(hotkeys.unbind).toHaveBeenCalledWith('*', CONTENT_EDIT_SCOPE);
    expect(hotkeys.setScope).toHaveBeenCalledWith(CONTENT_EDIT_SCOPE);
    expect(hotkeys).toHaveBeenCalledWith('ctrl+b, command+b', CONTENT_EDIT_SCOPE, expect.any(Function));
    expect(hotkeys).toHaveBeenCalledWith('ctrl+k, command+k', CONTENT_EDIT_SCOPE, expect.any(Function));
  });

  it('native style hotkey handler routes ctrl+b to content edit shortcut handler', () => {
    const boldHandler = jest.fn();
    const bridge = jest.fn((event) => {
      event.preventDefault();
      event.stopPropagation();
      boldHandler(event);
    });
    createContentEditStyleBridgeHandler.mockReturnValue(bridge);

    onContentEditModeStarted(dispatch, store)();

    const attachedBridge = ownerDocument.addEventListener.mock.calls[0][1];
    const event = {
      key: 'b',
      ctrlKey: true,
      metaKey: false,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };

    attachedBridge(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(boldHandler).toHaveBeenCalledWith(event);
  });

  it('disables the Style Panel when Content Edit starts', () => {
    onContentEditModeStarted(dispatch, store)();
    expect(dispatch).toHaveBeenCalledWith(actions.disableElement(DataElements.STYLE_PANEL));
  });
});
