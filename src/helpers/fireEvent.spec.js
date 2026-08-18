import fireEvent, { fireError, getEventHandler, INTERNAL_LOAD_ERROR_EVENT } from 'helpers/fireEvent';
import Events from 'constants/events';

jest.mock('helpers/getRootNode', () => () => global.document);

describe('fireEvent', () => {
  let handler;
  let originalCore;
  let originalEventHandler;

  beforeAll(() => {
    class MockEventHandler {
      constructor() {
        this._listeners = {};
      }
      addEventListener(name, fn) {
        (this._listeners[name] = this._listeners[name] || []).push(fn);
      }
      removeEventListener(name, fn) {
        this._listeners[name] = (this._listeners[name] || []).filter((f) => f !== fn);
      }
      async triggerAsync(name, data) {
        // Mirror Core EventHandler semantics: when `data` is an array, spread it as positional args.
        const listeners = this._listeners[name] || [];
        for (const fn of listeners) {
          if (data === undefined) {
            await fn();
          } else if (Array.isArray(data)) {
            await fn(...data);
          } else {
            await fn(data);
          }
        }
      }
    }
    originalCore = window.Core;
    originalEventHandler = originalCore && originalCore.EventHandler;
    window.Core = window.Core || {};
    window.Core.EventHandler = MockEventHandler;
  });

  afterAll(() => {
    if (originalCore === undefined) {
      delete window.Core;
    } else {
      window.Core = originalCore;
      if (originalEventHandler === undefined) {
        delete window.Core.EventHandler;
      } else {
        window.Core.EventHandler = originalEventHandler;
      }
    }
  });

  beforeEach(() => {
    handler = getEventHandler();
    handler._listeners = {};
  });

  it('spreads array payloads as positional arguments to the listener', async () => {
    const listener = jest.fn();
    handler.addEventListener(Events.VISIBILITY_CHANGED, listener);

    await fireEvent(Events.VISIBILITY_CHANGED, ['notesPanel', false]);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('notesPanel', false);
  });

  it('passes a non-array payload as a single positional argument', async () => {
    const listener = jest.fn();
    handler.addEventListener(Events.THEME_CHANGED, listener);

    await fireEvent(Events.THEME_CHANGED, 'dark');

    expect(listener).toHaveBeenCalledWith('dark');
  });

  it('passes an object payload as a single positional argument when not wrapped in an array', async () => {
    const listener = jest.fn();
    const bookmarkData = { bookmark: { id: '1' }, path: '0', action: 'setOutlineName' };
    handler.addEventListener(Events.OUTLINE_BOOKMARKS_CHANGED, listener);

    await fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkData);

    expect(listener).toHaveBeenCalledWith(bookmarkData);
  });

  it('preserves a single array argument by wrapping at the call site', async () => {
    const listener = jest.fn();
    const bookmarks = [{ id: 'a' }, { id: 'b' }];
    handler.addEventListener(Events.USER_BOOKMARKS_CHANGED, listener);

    await fireEvent(Events.USER_BOOKMARKS_CHANGED, [bookmarks]);

    expect(listener).toHaveBeenCalledWith(bookmarks);
  });

  it('invokes the listener with no arguments when payload is undefined', async () => {
    const listener = jest.fn();
    handler.addEventListener(Events.VIEWER_LOADED, listener);

    await fireEvent(Events.VIEWER_LOADED);

    expect(listener).toHaveBeenCalledWith();
  });

  it('does not invoke the EventHandler when an element target is provided', async () => {
    const target = document.createElement('div');
    const listener = jest.fn();
    target.addEventListener('ready', listener);

    await fireEvent('ready', undefined, target);

    expect(listener).toHaveBeenCalledTimes(1);
    const handlerListener = jest.fn();
    handler.addEventListener('ready', handlerListener);
    expect(handlerListener).not.toHaveBeenCalled();
  });

  describe('window backward-compat dispatch', () => {
    let windowListener;

    afterEach(() => {
      if (windowListener) {
        window.removeEventListener(windowListener.eventName, windowListener);
        windowListener = null;
      }
    });

    const attachWindowListener = (eventName) => {
      windowListener = jest.fn();
      windowListener.eventName = eventName;
      window.addEventListener(eventName, windowListener);
      return windowListener;
    };

    it('dispatches a CustomEvent on window whose detail is the args array for array payloads', async () => {
      const listener = attachWindowListener(Events.VISIBILITY_CHANGED);

      await fireEvent(Events.VISIBILITY_CHANGED, ['notesPanel', false]);

      expect(listener).toHaveBeenCalledTimes(1);
      const event = listener.mock.calls[0][0];
      expect(event).toBeInstanceOf(CustomEvent);
      expect(event.type).toBe(Events.VISIBILITY_CHANGED);
      expect(event.detail).toEqual(['notesPanel', false]);
    });

    it('passes single non-array payloads through as the raw detail value', async () => {
      const listener = attachWindowListener(Events.THEME_CHANGED);

      await fireEvent(Events.THEME_CHANGED, 'dark');

      const event = listener.mock.calls[0][0];
      expect(event.detail).toBe('dark');
    });

    it('passes single object payloads through as the raw detail value', async () => {
      const listener = attachWindowListener(Events.OUTLINE_BOOKMARKS_CHANGED);
      const bookmarkData = { bookmark: { id: '1' }, path: '0', action: 'setOutlineName' };

      await fireEvent(Events.OUTLINE_BOOKMARKS_CHANGED, bookmarkData);

      const event = listener.mock.calls[0][0];
      expect(event.detail).toBe(bookmarkData);
    });

    it('uses null detail for events fired with no payload (CustomEvent default; matches legacy)', async () => {
      const listener = attachWindowListener(Events.VIEWER_LOADED);

      await fireEvent(Events.VIEWER_LOADED);

      const event = listener.mock.calls[0][0];
      expect(event.detail).toBeNull();
    });

    it('does not dispatch on window when an element target is provided', async () => {
      const listener = attachWindowListener('ready');
      const target = document.createElement('div');

      await fireEvent('ready', undefined, target);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('fireError', () => {
    it('keeps the public loaderror payload unchanged for Error objects', async () => {
      const publicListener = jest.fn();
      const internalListener = jest.fn();

      window.addEventListener(Events.LOAD_ERROR, publicListener);
      window.addEventListener(INTERNAL_LOAD_ERROR_EVENT, internalListener);

      const originalError = new Error('boom');
      fireError(originalError, 'dv-2');

      await Promise.resolve();
      await Promise.resolve();

      expect(publicListener).toHaveBeenCalledTimes(1);
      expect(publicListener.mock.calls[0][0].detail).toBe(originalError);

      expect(internalListener).toHaveBeenCalledTimes(1);
      expect(internalListener.mock.calls[0][0].detail).toMatchObject({
        error: originalError,
        message: 'boom',
        documentViewerId: 'dv-2',
      });

      window.removeEventListener(Events.LOAD_ERROR, publicListener);
      window.removeEventListener(INTERNAL_LOAD_ERROR_EVENT, internalListener);
    });

    it('keeps the public loaderror payload unchanged for string payloads', async () => {
      const publicListener = jest.fn();
      const internalListener = jest.fn();

      window.addEventListener(Events.LOAD_ERROR, publicListener);
      window.addEventListener(INTERNAL_LOAD_ERROR_EVENT, internalListener);

      fireError('plain string error', 'dv-7');

      await Promise.resolve();
      await Promise.resolve();

      expect(publicListener).toHaveBeenCalledTimes(1);
      expect(publicListener.mock.calls[0][0].detail).toBe('plain string error');

      expect(internalListener).toHaveBeenCalledTimes(1);
      expect(internalListener.mock.calls[0][0].detail).toMatchObject({
        error: 'plain string error',
        message: 'plain string error',
        documentViewerId: 'dv-7',
      });
      expect(internalListener.mock.calls[0][0].detail.message).not.toContain('DocumentViewerId:');

      window.removeEventListener(Events.LOAD_ERROR, publicListener);
      window.removeEventListener(INTERNAL_LOAD_ERROR_EVENT, internalListener);
    });
  });
});
