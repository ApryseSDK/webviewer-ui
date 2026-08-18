import hotkeys from 'hotkeys-js';
import hotkeysManager, { createHotkeysManager, defaultHotkeysScope } from './hotkeysManager';
import { createHotkeysAPI } from 'src/apis/hotkeys';
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
  const DEFAULT_SHORTCUT_KEY_MAP = {
    [Shortcuts.COPY]: Keys.CTRL_C,
    [Shortcuts.SQUIGGLY]: Keys.G,
    [Shortcuts.SWITCH_PAN]: Keys.SPACE,
  };
  let shortcutKeyMap;
  const mockStore = {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      shortcutKeyMap,
    })),
  };
  beforeEach(() => {
    shortcutKeyMap = { ...DEFAULT_SHORTCUT_KEY_MAP };
    const getTool = () => ({
      setStyles: jest.fn(),
      name: 'AnnotationCreateRectangle',
      defaults: {
        'StrokeThickness': 1,
        'Opacity': 1,
      },
    });
    selectors.getShortcutKeyMap = jest.fn((state) => (state.shortcutKeyMap || {}));
    selectors.getActiveDocumentViewerKey = jest.fn(() => 1);
    selectors.isViewportRelativeAnnotationPositioningEnabled = jest.fn(() => false);
    core.getToolModeMap = jest.fn(() => ({ 'AnnotationCreateRectangle': getTool() }));
    core.pasteCopiedAnnotations = jest.fn();
    core.getAnnotationManager = jest.fn().mockReturnValue({
      getEditBoxManager: jest.fn().mockReturnValue({
        getEditor: jest.fn().mockReturnValue(null),
      }),
    });
    core.getAnnotationsList = jest.fn().mockReturnValue([]);
    core.getContentEditManager = jest.fn(() => ({
      isInContentEditMode: () => false,
    }));
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
      expect(hotkeys.unbind).toHaveBeenCalled();
      expect(hotkeys.unbind).not.toHaveBeenCalledWith(undefined, undefined);
    });

    it('should disable composed shortcut listeners when off is called with a single key', () => {
      const undoHandler = jest.fn();

      hotkeysManager.on(ShortcutKeys[Shortcuts.UNDO], undoHandler);
      hotkeys.unbind.mockClear();

      hotkeysManager.off(Keys.CTRL_Z);

      expect(hotkeys.unbind).toHaveBeenCalledWith(Keys.CTRL_Z, expect.any(Function));
    });
  });

  describe('multi-instance API isolation', () => {
    it('keeps A public API bound to A after B initializes', () => {
      const rootA = { id: 'root-a', host: { id: 'root-a-host' } };
      const rootB = { id: 'root-b', host: { id: 'root-b-host' } };
      const storeA = {
        dispatch: jest.fn(),
        getState: jest.fn(() => ({
          shortcutKeyMap: {
            [Shortcuts.COPY]: 'ctrl+a',
          },
        })),
      };
      const storeB = {
        dispatch: jest.fn(),
        getState: jest.fn(() => ({
          shortcutKeyMap: {
            [Shortcuts.COPY]: 'ctrl+b',
          },
        })),
      };
      const managerA = createHotkeysManager();
      const managerB = createHotkeysManager();
      const apiA = createHotkeysAPI(managerA);

      managerA.initialize(storeA, rootA);
      managerB.initialize(storeB, rootB);

      const handlerA = jest.fn();
      managerA.keyHandlerMap[ShortcutKeys[Shortcuts.COPY]] = handlerA;

      // register through A's public API after B has already initialized
      apiA.on('ctrl+alt+7', handlerA);

      const ctrlAlt7Callbacks = hotkeys.mock.calls
        .filter((call) => call[0] === 'ctrl+alt+7')
        .map((call) => call[2]);

      ctrlAlt7Callbacks.forEach((callback) => callback({
        key: '7',
        type: 'keydown',
        target: { getRootNode: () => rootA },
        currentTarget: { activeElement: null },
      }));
      expect(handlerA).toHaveBeenCalledTimes(1);

      apiA.trigger('ctrl+a');
      expect(handlerA).toHaveBeenCalledTimes(2);
    });

    it('tearing down A only unbinds A-managed handlers', () => {
      const rootA = { id: 'root-a', host: { id: 'root-a-host' } };
      const rootB = { id: 'root-b', host: { id: 'root-b-host' } };
      const baseStore = {
        dispatch: jest.fn(),
        getState: jest.fn(() => ({
          shortcutKeyMap: {
            [Shortcuts.COPY]: Keys.CTRL_C,
          },
        })),
      };

      const managerA = createHotkeysManager();
      const managerB = createHotkeysManager();
      const handlerA = jest.fn();
      const handlerB = jest.fn();

      managerA.initialize(baseStore, rootA);
      managerB.initialize(baseStore, rootB);

      managerA.on('ctrl+alt+8', handlerA);
      managerB.on('ctrl+alt+8', handlerB);

      const ctrlAlt8Callbacks = hotkeys.mock.calls
        .filter((call) => call[0] === 'ctrl+alt+8')
        .map((call) => call[2]);

      let callbackA;
      let callbackB;
      ctrlAlt8Callbacks.forEach((callback) => {
        callback({
          key: '8',
          type: 'keydown',
          target: { getRootNode: () => rootA },
          currentTarget: { activeElement: null },
        });

        if (handlerA.mock.calls.length > 0) {
          callbackA = callback;
          handlerA.mockClear();
        }
      });

      ctrlAlt8Callbacks.forEach((callback) => {
        callback({
          key: '8',
          type: 'keydown',
          target: { getRootNode: () => rootB },
          currentTarget: { activeElement: null },
        });

        if (handlerB.mock.calls.length > 0) {
          callbackB = callback;
          handlerB.mockClear();
        }
      });

      expect(callbackA).toBeDefined();
      expect(callbackB).toBeDefined();

      hotkeys.unbind.mockClear();
      managerA.off();

      const unboundCtrlAlt8Callbacks = hotkeys.unbind.mock.calls
        .filter((call) => call[0] === 'ctrl+alt+8')
        .map((call) => call[1]);

      expect(unboundCtrlAlt8Callbacks).toContain(callbackA);
      expect(unboundCtrlAlt8Callbacks).not.toContain(callbackB);
    });

    it('does not unbind B handlers when A calls off(key) without owning key listeners', () => {
      const rootA = { id: 'root-a', host: { id: 'root-a-host' } };
      const rootB = { id: 'root-b', host: { id: 'root-b-host' } };
      const baseStore = {
        dispatch: jest.fn(),
        getState: jest.fn(() => ({
          shortcutKeyMap: {
            [Shortcuts.COPY]: Keys.CTRL_C,
          },
        })),
      };

      const managerA = createHotkeysManager();
      const managerB = createHotkeysManager();
      const handlerB = jest.fn();

      managerA.initialize(baseStore, rootA);
      managerB.initialize(baseStore, rootB);
      managerB.on('ctrl+alt+9', handlerB);

      hotkeys.unbind.mockClear();
      managerA.off('ctrl+alt+9');

      expect(hotkeys.unbind).not.toHaveBeenCalledWith('ctrl+alt+9');

      const ctrlAlt9Callbacks = hotkeys.mock.calls
        .filter((call) => call[0] === 'ctrl+alt+9')
        .map((call) => call[2]);

      ctrlAlt9Callbacks.forEach((callback) => callback({
        key: '9',
        type: 'keydown',
        target: { getRootNode: () => rootB },
        currentTarget: { activeElement: null },
      }));

      expect(handlerB).toHaveBeenCalledTimes(1);
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

    it('should route key events only to the matching webcomponent instance root', () => {
      const originalIsWebComponent = window.isApryseWebViewerWebComponent;
      try {
        window.isApryseWebViewerWebComponent = true;

        const firstRoot = { id: 'first-root', host: { id: 'first-host' } };
        const secondRoot = { id: 'second-root', host: { id: 'second-host' } };
        const firstHandler = jest.fn();
        const secondHandler = jest.fn();

        hotkeysManager.initialize(mockStore, firstRoot);
        hotkeysManager.enableHotkey('ctrl+alt+1', firstHandler);

        hotkeysManager.initialize(mockStore, secondRoot);
        hotkeysManager.enableHotkey('ctrl+alt+1', secondHandler);

        const matchingFirstEvent = {
          key: '1',
          type: 'keydown',
          target: {
            getRootNode: () => firstRoot,
          },
          currentTarget: {
            activeElement: null,
          },
        };

        const matchingSecondEvent = {
          key: '1',
          type: 'keydown',
          target: {
            getRootNode: () => secondRoot,
          },
          currentTarget: {
            activeElement: null,
          },
        };

        const callbacks = hotkeys.mock.calls
          .filter((call) => call[0] === 'ctrl+alt+1')
          .map((call) => call[2]);

        callbacks.forEach((callback) => callback(matchingFirstEvent));
        expect(firstHandler).toHaveBeenCalledTimes(1);
        expect(secondHandler).toHaveBeenCalledTimes(0);

        callbacks.forEach((callback) => callback(matchingSecondEvent));
        expect(firstHandler).toHaveBeenCalledTimes(1);
        expect(secondHandler).toHaveBeenCalledTimes(1);

        // Simulate retargeted keyboard events where target is the WC host:
        // host.getRootNode() is document, but host.shadowRoot should still
        // resolve to the owning instance.
        const hostLikeTargetForFirstInstance = {
          shadowRoot: firstRoot,
          getRootNode: () => document,
        };
        const retargetedHostEvent = {
          key: '1',
          type: 'keydown',
          composedPath: () => [hostLikeTargetForFirstInstance],
          target: hostLikeTargetForFirstInstance,
          currentTarget: {
            activeElement: hostLikeTargetForFirstInstance,
          },
        };

        callbacks.forEach((callback) => callback(retargetedHostEvent));
        expect(firstHandler).toHaveBeenCalledTimes(2);
        expect(secondHandler).toHaveBeenCalledTimes(1);
      } finally {
        window.isApryseWebViewerWebComponent = originalIsWebComponent;
      }
    });

    it('should not invoke non-escape handlers while content edit mode is active', () => {
      core.getContentEditManager = jest.fn(() => ({
        isInContentEditMode: () => true,
      }));

      const handler = jest.fn();
      hotkeysManager.enableHotkey('ctrl+v', handler);

      const event = {
        key: 'v',
        type: 'keydown',
        target: {
          getRootNode: () => document,
        },
        currentTarget: {
          activeElement: null,
        },
      };

      const boundHandler = hotkeys.mock.calls.find((call) => call[0] === 'ctrl+v')[2];
      boundHandler(event);

      expect(handler).not.toHaveBeenCalled();
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

    it('should pass viewportRelative paste options when the setting is enabled', () => {
      selectors.isViewportRelativeAnnotationPositioningEnabled.mockReturnValue(true);
      selectors.getActiveDocumentViewerKey.mockReturnValue(7);

      const keyHandlerMap = hotkeysManager.createKeyHandlerMap(mockStore);
      const pasteHandler = keyHandlerMap[ShortcutKeys[Shortcuts.PASTE]];
      const event = { preventDefault: jest.fn() };

      pasteHandler(event);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(core.pasteCopiedAnnotations).toHaveBeenCalledWith(7, { viewportRelative: true });
    });

    it('should preserve default paste behavior when the setting is disabled', () => {
      selectors.isViewportRelativeAnnotationPositioningEnabled.mockReturnValue(false);
      selectors.getActiveDocumentViewerKey.mockReturnValue(3);

      const keyHandlerMap = hotkeysManager.createKeyHandlerMap(mockStore);
      const pasteHandler = keyHandlerMap[ShortcutKeys[Shortcuts.PASTE]];
      const event = { preventDefault: jest.fn() };

      pasteHandler(event);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(core.pasteCopiedAnnotations).toHaveBeenCalledWith(3, undefined);
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
      expect(hotkeys.unbind).toHaveBeenCalledWith(Keys.CTRL_C, expect.any(Function));
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
      expect(hotkeys.unbind).toHaveBeenCalledWith(Keys.CTRL_C, expect.any(Function));
    });
  });

  describe('setViewOnlyMode', () => {
    it('should store and restore pre-viewOnly state when toggling viewOnly mode', () => {
      let isShortcutActive = hotkeysManager.isActive(Shortcuts.COPY);
      expect(isShortcutActive).toBe(true);

      hotkeysManager.setViewOnlyMode(true);
      isShortcutActive = hotkeysManager.isActive(Shortcuts.COPY);
      expect(isShortcutActive).toBe(false);
      expect(hotkeys.unbind).toHaveBeenCalled();
      expect(hotkeys.unbind).not.toHaveBeenCalledWith(undefined, undefined);

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

  describe('trigger', () => {
    it('should invoke the keydown handler for a valid key combo', () => {
      const copyKey = ShortcutKeys[Shortcuts.COPY];
      const mockHandler = jest.fn();
      hotkeysManager.keyHandlerMap[copyKey] = mockHandler;

      hotkeysManager.on();
      hotkeysManager.trigger('ctrl+c');

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).toHaveBeenCalledWith(expect.objectContaining({
        type: 'keydown',
        preventDefault: expect.any(Function),
        stopPropagation: expect.any(Function),
      }));
    });

    it('should invoke the keyup handler when eventType is keyup', () => {
      const switchPanKey = ShortcutKeys[Shortcuts.SWITCH_PAN];
      const keydownFn = jest.fn();
      const keyupFn = jest.fn();
      hotkeysManager.keyHandlerMap[switchPanKey] = { keydown: keydownFn, keyup: keyupFn };

      hotkeysManager.on();
      hotkeysManager.trigger('space', 'keyup');

      expect(keyupFn).toHaveBeenCalledTimes(1);
      expect(keydownFn).not.toHaveBeenCalled();
    });

    it('should invoke keydown handler on object-style handlers by default', () => {
      const switchPanKey = ShortcutKeys[Shortcuts.SWITCH_PAN];
      const keydownFn = jest.fn();
      const keyupFn = jest.fn();
      hotkeysManager.keyHandlerMap[switchPanKey] = { keydown: keydownFn, keyup: keyupFn };

      hotkeysManager.on();
      hotkeysManager.trigger('space');

      expect(keydownFn).toHaveBeenCalledTimes(1);
      expect(keyupFn).not.toHaveBeenCalled();
    });

    it('should warn and not invoke handler when shortcut is disabled', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const copyKey = ShortcutKeys[Shortcuts.COPY];
      const mockHandler = jest.fn();
      hotkeysManager.keyHandlerMap[copyKey] = mockHandler;

      hotkeysManager.off();
      hotkeysManager.trigger('ctrl+c');

      expect(mockHandler).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('currently disabled'));
      warnSpy.mockRestore();
    });

    it('should warn when called with an unknown key combo', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      hotkeysManager.trigger('ctrl+shift+alt+z');

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no handler found'));
      warnSpy.mockRestore();
    });

    it('should warn when called with no arguments', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      hotkeysManager.trigger();

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('key combo string is required'));
      warnSpy.mockRestore();
    });

    it('should warn when called with a non-string argument', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      hotkeysManager.trigger(123);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('key combo string is required'));
      warnSpy.mockRestore();
    });

    it('should warn when called with an invalid eventType', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const copyKey = ShortcutKeys[Shortcuts.COPY];
      hotkeysManager.keyHandlerMap[copyKey] = jest.fn();

      hotkeysManager.on();
      hotkeysManager.trigger('ctrl+c', 'click');

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('eventType must be'));
      warnSpy.mockRestore();
    });

    it('should warn when trying keyup on a function-only handler', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const copyKey = ShortcutKeys[Shortcuts.COPY];
      hotkeysManager.keyHandlerMap[copyKey] = jest.fn();

      hotkeysManager.on();
      hotkeysManager.trigger('ctrl+c', 'keyup');

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('only has a keydown handler'));
      warnSpy.mockRestore();
    });

    it('should match key combo case-insensitively', () => {
      const copyKey = ShortcutKeys[Shortcuts.COPY];
      const mockHandler = jest.fn();
      hotkeysManager.keyHandlerMap[copyKey] = mockHandler;

      hotkeysManager.on();
      hotkeysManager.trigger('Ctrl+C');

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should trigger handler via remapped key combo string', () => {
      const bookmarkDefault = ShortcutKeys[Shortcuts.BOOKMARK];
      const mockHandler = jest.fn();
      hotkeysManager.keyHandlerMap[bookmarkDefault] = mockHandler;

      shortcutKeyMap[Shortcuts.BOOKMARK] = 'command+[';

      hotkeysManager.on();
      hotkeysManager.trigger('command+[');

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should not trigger remapped shortcut via old key combo', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const bookmarkDefault = ShortcutKeys[Shortcuts.BOOKMARK];
      const mockHandler = jest.fn();
      hotkeysManager.keyHandlerMap[bookmarkDefault] = mockHandler;

      shortcutKeyMap[Shortcuts.BOOKMARK] = 'command+[';

      hotkeysManager.on();
      hotkeysManager.trigger('ctrl+b');

      expect(mockHandler).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no handler found'));

      warnSpy.mockRestore();
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