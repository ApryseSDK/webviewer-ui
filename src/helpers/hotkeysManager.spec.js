import hotkeys from 'hotkeys-js';
import hotkeysManager, { defaultHotkeysScope } from './hotkeysManager';
import { Keys, Shortcuts, ShortcutKeys, isShortcutInToolList } from './hotkeysUtils';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import { panelNames } from 'src/constants/panel';
import DataElements from 'src/constants/dataElement';
import i18next from 'i18next';

jest.mock('hotkeys-js', () => {
  const fn = jest.fn();
  fn.unbind = jest.fn();
  fn.setScope = jest.fn();
  return fn;
});
jest.mock('./hotkeysUtils', () => ({
  ...jest.requireActual('./hotkeysUtils'),
  getViewOnlyShortcuts: jest.fn(() => []),
}));

describe('hotkeysManager', () => {
  const shortcutKeyMap = {
    [Shortcuts.COPY]: Keys.CTRL_C,
    [Shortcuts.SQUIGGLY]: Keys.G,
  };
  const mockStore = {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      shortcutKeyMap,
    })),
  };
  beforeEach(() => {
    const getTool = () => ({
      setStyles: jest.fn(),
      name: 'AnnotationCreateRectangle',
      defaults: {
        'StrokeThickness': 1,
        'Opacity': 1,
      },
    });
    selectors.getShortcutKeyMap = jest.fn((state) => (state.shortcutKeyMap || {}));
    core.getToolModeMap = jest.fn(() => ({ 'AnnotationCreateRectangle': getTool() }));
    hotkeysManager.initialize(mockStore);
  });
  afterEach(() => {
    hotkeysManager.off();
    jest.clearAllMocks();
  });

  it('should initialize without error', () => {
    expect(hotkeys.setScope).toHaveBeenCalledWith(defaultHotkeysScope);
    expect(hotkeys).toHaveBeenCalled();
  });

  describe('on', () => {
    it('should use the default event handler for the given hotkey', () => {
      const enableHotkeySpy = jest.spyOn(hotkeysManager, 'enableHotkey');
      const handler = hotkeysManager.getDefaultKeyHandler(Keys.CTRL_EQUAL);
      hotkeysManager.on(Keys.CTRL_EQUAL);
      expect(enableHotkeySpy).toHaveBeenCalledWith(Keys.CTRL_EQUAL, handler);
    });

    it('should use the custom event handler when provided', () => {
      const enableHotkeySpy = jest.spyOn(hotkeysManager, 'enableHotkey');
      const mockEvent = { preventDefault: jest.fn() };
      const handler = jest.fn(() => {
        mockEvent.preventDefault();
      });
      hotkeysManager.on(Keys.CTRL_EQUAL, handler);
      expect(enableHotkeySpy).toHaveBeenCalledWith(Keys.CTRL_EQUAL, handler);
    });

    it('should add an event handler for the hotkey associated with the given tool name', () => {
      const toolName = 'AnnotationCreateRectangle';
      const enableHotkeySpy = jest.spyOn(hotkeysManager, 'enableHotkey');
      const handler = hotkeysManager.getDefaultKeyHandler(Keys.R);
      hotkeysManager.on(toolName);
      expect(enableHotkeySpy).toHaveBeenCalledWith(Keys.R, handler);
    });
  });

  describe('off', () => {
    it('should unbind the given hotkey', () => {
      const mockEvent = { preventDefault: jest.fn() };
      const handler = jest.fn(() => {
        mockEvent.preventDefault();
      });
      hotkeysManager.off(Keys.CTRL_C, handler);
      expect(hotkeys.unbind).toHaveBeenCalledWith(Keys.CTRL_C, handler);
    });

    it('should unbind all hotkeys when none given', () => {
      hotkeysManager.off();
      expect(hotkeys.unbind).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('isActive', () => {
    it('should return true if shortcut is active', () => {
      hotkeysManager.on();
      expect(hotkeysManager.isActive(Shortcuts.COPY)).toBe(true);
    });

    it('should return false if shortcut is not active', () => {
      hotkeysManager.off();
      expect(hotkeysManager.isActive(Shortcuts.COPY)).toBe(false);
    });
  });

  describe('enableHotkey', () => {
    it('should bind the given hotkey to the given handler', () => {
      const handler = jest.fn();
      hotkeysManager.enableHotkey(Keys.ESCAPE, handler);
      expect(hotkeys).toHaveBeenCalledWith(
        Keys.ESCAPE,
        { keyup: true, scope: defaultHotkeysScope },
        expect.any(Function)
      );

      // Call the new handler to check if it invokes the original handler
      const e = {
        key: 'Escape',
        type: 'keydown',
        preventDefault: () => {},
        currentTarget: {
          activeElement: {
            shadowRoot: null,
          }
        }
      };
      const boundHandler = hotkeys.mock.calls.find((call) => call[0] === Keys.ESCAPE)[2];
      boundHandler(e);
      expect(handler).toHaveBeenCalledWith(e);
    });
  });

  describe('getDefaultKeyHandler', () => {
    it('should return a handler for simple shortcuts', () => {
      const handler = hotkeysManager.getDefaultKeyHandler(Keys.CTRL_C);
      expect(typeof handler).toBe('function');
    });
    it('should return a handler for composed shortcuts', () => {
      const ctrlC = Keys.CTRL_C;
      const ctrlF = Keys.CTRL_F;
      const commandF = Keys.COMMAND_F;
      const composedF = ShortcutKeys[Shortcuts.SEARCH];

      const ctrlCHandler = hotkeysManager.getDefaultKeyHandler(ctrlC);
      const ctrlFHandler = hotkeysManager.getDefaultKeyHandler(ctrlF);
      const commandFHandler = hotkeysManager.getDefaultKeyHandler(commandF);
      const composedFHandler = hotkeysManager.getDefaultKeyHandler(composedF);

      expect(typeof composedFHandler).toBe('function');
      expect(composedFHandler).toBe(ctrlFHandler);
      expect(composedFHandler).toBe(commandFHandler);

      expect(typeof ctrlCHandler).toBe('function');
      expect(composedFHandler).not.toBe(ctrlCHandler);
    });
  });

  describe('createKeyHandlerMap', () => {
    it('should return an object mapping shortcut keys to handlers', () => {
      const keyHandlerMap = hotkeysManager.createKeyHandlerMap(mockStore);
      expect(typeof keyHandlerMap).toBe('object');
      expect(typeof keyHandlerMap[ShortcutKeys[Shortcuts.COPY]]).toBe('function');
      expect(typeof keyHandlerMap[ShortcutKeys[Shortcuts.BOOKMARK]]).toBe('function');
      expect(typeof keyHandlerMap[ShortcutKeys[Shortcuts.ROTATE_CLOCKWISE]]).toBe('function');
    });
  });

  describe('createToolHotkeyHandler', () => {
    it('should return a new handler that wraps the given handler', () => {
      selectors.getOpenElements = jest.fn(() => []);
      core.getAnnotationsList = jest.fn(() => []);
      core.getToolMode = jest.fn(() => 'AnnotationCreateRectangle');
      const args = [1, 2, 3];
      const handler = jest.fn();
      const getToolModeSpy = jest.spyOn(core, 'getToolMode');
      const wrappedHandler = hotkeysManager.createToolHotkeyHandler(handler);
      wrappedHandler(...args);
      expect(handler).toHaveBeenCalledWith(...args);
      expect(getToolModeSpy).toHaveBeenCalled();
    });
  });

  describe('getShortcutKeyMap', () => {
    it('should return the shortcut key map from state', () => {
      const currentMap = hotkeysManager.getShortcutKeyMap();
      expect(currentMap).toEqual(shortcutKeyMap);
    });
  });

  describe('setShortcutKey', () => {
    it('should update the shortcut key for the given shortcut', () => {
      core.getAnnotationManager = jest.fn(() => ({
        isReadOnlyModeEnabled: () => false,
      }));
      hotkeysManager.setShortcutKey(Shortcuts.COPY, Keys.CTRL_DOWN);
      expect(hotkeys.unbind).toHaveBeenCalledWith(Keys.CTRL_C, undefined);
      expect(hotkeys).toHaveBeenCalledWith(
        Keys.CTRL_DOWN,
        { keyup: true, scope: defaultHotkeysScope },
        expect.any(Function)
      );
    });
  });

  describe('hasConflict', () => {
    it('should return false if the given command matches its existing shortcut', () => {
      const hasConflict = hotkeysManager.hasConflict(Shortcuts.COPY, Keys.CTRL_C);
      expect(hasConflict).toBe(false);
    });

    it('should return false if the given command is not being used by any other shortcuts', () => {
      const hasConflict = hotkeysManager.hasConflict('doSomething', Keys.CTRL_X);
      expect(hasConflict).toBe(false);
    });

    it('should return true if the given command is being used by another shortcut', () => {
      const hasConflict = hotkeysManager.hasConflict('doSomething', Keys.CTRL_C);
      expect(hasConflict).toBe(true);
    });
  });

  describe('disableShortcut', () => {
    it('should unbind the given shortcut key', () => {
      hotkeysManager.disableShortcut(Shortcuts.COPY);
      expect(hotkeys.unbind).toHaveBeenCalledWith(Keys.CTRL_C, undefined);
    });
  });

  describe('setViewOnlyMode', () => {
    it('should store and restore pre-viewOnly state when toggling viewOnly mode', () => {
      let isShortcutActive = hotkeysManager.isActive(Shortcuts.COPY);
      expect(isShortcutActive).toBe(true);

      hotkeysManager.setViewOnlyMode(true);
      isShortcutActive = hotkeysManager.isActive(Shortcuts.COPY);
      expect(isShortcutActive).toBe(false);
      expect(hotkeys.unbind).toHaveBeenCalledWith(undefined, undefined);

      hotkeysManager.setViewOnlyMode(false);
      isShortcutActive = hotkeysManager.isActive(Shortcuts.COPY);
      expect(isShortcutActive).toBe(true);
      expect(hotkeys).toHaveBeenCalledWith(
        Keys.CTRL_C,
        { keyup: true, scope: defaultHotkeysScope },
        expect.any(Function)
      );
    });
  });

  describe('isShortcutInToolList', () => {
    it('should return true if the shortcut is associated with a tool', () => {
      const isInToolList = isShortcutInToolList(Shortcuts.ERASER, ['AnnotationEraserTool']);
      expect(isInToolList).toBe(true);
    });

    it('should return false if the shortcut is not associated with a tool', () => {
      const isInToolList = isShortcutInToolList(Shortcuts.ERASER, ['Pan']);
      expect(isInToolList).toBe(false);
    });
  });
});

describe('hotkeysManager - Bookmark Shortcut Integration Tests', () => {
  let mockStore;
  let mockDispatch;
  let mockGetState;
  let mockState;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockGetState = jest.fn();
    mockStore = {
      dispatch: mockDispatch,
      getState: mockGetState,
    };

    mockState = {
      viewer: {
        disabledElements: {},
        featureFlags: { customizableUI: true },
        activeDocumentViewerKey: 1,
      },
    };
    mockGetState.mockReturnValue(mockState);

    selectors.isElementDisabled = jest.fn().mockReturnValue(false);
    selectors.getFeatureFlags = jest.fn().mockReturnValue({ customizableUI: true });
    selectors.getActiveDocumentViewerKey = jest.fn().mockReturnValue(1);
    selectors.getShortcutKeyMap = jest.fn().mockReturnValue(ShortcutKeys);

    core.getUserBookmarks = jest.fn().mockReturnValue({});
    core.getCurrentPage = jest.fn().mockReturnValue(1);
    core.getToolModeMap = jest.fn().mockReturnValue({});
    core.addUserBookmark = jest.fn();

    i18next.t = jest.fn().mockReturnValue('Untitled');

    actions.openElement = jest.fn((element) => ({ type: 'OPEN_ELEMENT', element }));
    actions.setActiveTabInPanel = jest.fn((tab, panel) => ({
      type: 'SET_ACTIVE_TAB',
      tab,
      panel
    }));
    actions.setActiveLeftPanel = jest.fn((panel) => ({
      type: 'SET_ACTIVE_LEFT_PANEL',
      panel
    }));

    hotkeysManager.initialize(mockStore);
  });

  afterEach(() => {
    hotkeysManager.off();
    jest.clearAllMocks();
  });

  describe('Bookmark shortcut (Ctrl+B / Command+B)', () => {
    it('should handle bookmark shortcut in modular UI mode', () => {
      mockState.viewer.featureFlags.customizableUI = true;
      selectors.getFeatureFlags.mockReturnValue({ customizableUI: true });

      const bookmarkShortcutKey = ShortcutKeys[Shortcuts.BOOKMARK];
      const bookmarkHandler = hotkeysManager.keyHandlerMap[bookmarkShortcutKey];
      const mockEvent = { preventDefault: jest.fn() };
      bookmarkHandler(mockEvent);

      expect(mockDispatch).toHaveBeenCalledWith(
        actions.openElement(panelNames.TABS)
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        actions.setActiveTabInPanel(DataElements.BOOKMARK_PANEL, panelNames.TABS)
      );
    });

    it('should handle bookmark shortcut in legacy UI mode', () => {
      mockState.viewer.featureFlags.customizableUI = false;
      selectors.getFeatureFlags.mockReturnValue({ customizableUI: false });

      const bookmarkShortcutKey = ShortcutKeys[Shortcuts.BOOKMARK];
      const bookmarkHandler = hotkeysManager.keyHandlerMap[bookmarkShortcutKey];
      const mockEvent = { preventDefault: jest.fn() };
      bookmarkHandler(mockEvent);

      expect(mockDispatch).toHaveBeenCalledWith(
        actions.openElement(DataElements.LEFT_PANEL)
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        actions.setActiveLeftPanel(DataElements.BOOKMARK_PANEL)
      );
    });
  });
});