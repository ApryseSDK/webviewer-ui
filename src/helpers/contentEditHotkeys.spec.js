import core from 'core';
import selectors from 'selectors';
import { resolveContentEditShortcutHandler } from './contentEditHotkeys';
import { Shortcuts, ShortcutKeys } from './hotkeysUtils';

describe('contentEditHotkeys', () => {
  const getState = jest.fn(() => ({}));

  beforeEach(() => {
    selectors.isContentEditingEnabled = jest.fn(() => true);
    selectors.getActiveDocumentViewerKey = jest.fn(() => 1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupViewer = () => {
    const undo = jest.fn();
    const viewerElement = document.createElement('div');
    const contentBox = document.createElement('div');
    viewerElement.appendChild(contentBox);
    document.body.appendChild(viewerElement);

    core.getDocumentViewer = jest.fn(() => ({
      getViewerElement: () => viewerElement,
      getContentEditManager: () => ({ undo }),
    }));

    const fallbackHandler = jest.fn();
    const hotkeysManager = {
      keyHandlerMap: {
        [ShortcutKeys[Shortcuts.UNDO]]: fallbackHandler,
      },
    };

    return { undo, viewerElement, contentBox, hotkeysManager, fallbackHandler };
  };

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('routes undo to content edit manager when scoped handler is requested', () => {
    const { undo, contentBox, hotkeysManager, fallbackHandler } = setupViewer();

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: contentBox,
      composedPath: () => [contentBox, document.body],
    };
    handler(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
    expect(fallbackHandler).not.toHaveBeenCalled();
  });

  it('routes undo when the event comes from the context popup menu outside the viewer', () => {
    const { undo, hotkeysManager } = setupViewer();
    const popupButton = document.createElement('button');
    document.body.appendChild(popupButton);

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: popupButton,
      composedPath: () => [popupButton, document.body, document, window],
    };
    handler(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
  });

  it('routes undo when the event comes from a style panel button outside the viewer', () => {
    const { undo, hotkeysManager } = setupViewer();
    const styleButton = document.createElement('button');
    document.body.appendChild(styleButton);

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: styleButton,
      composedPath: () => [styleButton, document.body, document, window],
    };
    handler(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
  });

  it('routes undo when focus has fallen back to document.body', () => {
    const { undo, hotkeysManager } = setupViewer();

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: document.body,
      composedPath: () => [document.body, document, window],
    };
    handler(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
  });

  it('routes undo to content edit manager when event target is retargeted by shadow DOM', () => {
    const { undo, contentBox, hotkeysManager } = setupViewer();
    const shadowHost = document.createElement('div');

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: shadowHost,
      composedPath: () => [contentBox, shadowHost, document.body],
    };
    handler(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
  });

  it('does not route undo when the event targets a text input outside the viewer', () => {
    const { undo, hotkeysManager } = setupViewer();
    const input = document.createElement('input');
    document.body.appendChild(input);

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: input,
      composedPath: () => [input, document.body, document, window],
    };
    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(undo).not.toHaveBeenCalled();
  });

  it('does not route undo when the event targets a contenteditable outside the viewer', () => {
    const { undo, hotkeysManager } = setupViewer();
    const editable = document.createElement('div');
    Object.defineProperty(editable, 'isContentEditable', { value: true });
    document.body.appendChild(editable);

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: editable,
      composedPath: () => [editable, document.body, document, window],
    };
    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(undo).not.toHaveBeenCalled();
  });

  it('routes undo when the text entry is inside the viewer element', () => {
    const { undo, viewerElement, hotkeysManager } = setupViewer();
    const boxInput = document.createElement('input');
    viewerElement.appendChild(boxInput);

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: boxInput,
      composedPath: () => [boxInput, viewerElement, document.body, document, window],
    };
    handler(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
  });

  it('handles composedPath with document and window without throwing', () => {
    const { undo, viewerElement, contentBox, hotkeysManager } = setupViewer();

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: contentBox,
      composedPath: () => [contentBox, viewerElement, document.body, document, window],
    };

    expect(() => handler(event)).not.toThrow();
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(undo).toHaveBeenCalledTimes(1);
  });

  it('falls back to event.target when composedPath is unavailable', () => {
    const { undo, hotkeysManager } = setupViewer();
    const input = document.createElement('input');
    document.body.appendChild(input);

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = { preventDefault: jest.fn(), target: input };
    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(undo).not.toHaveBeenCalled();
  });

  it('does not route undo when content editing is disabled', () => {
    const { undo, contentBox, hotkeysManager } = setupViewer();
    selectors.isContentEditingEnabled = jest.fn(() => false);

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState, true);
    const event = {
      preventDefault: jest.fn(),
      target: contentBox,
      composedPath: () => [contentBox, document.body],
    };
    handler(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(undo).not.toHaveBeenCalled();
  });

  it('falls back to manager handler for undo when scoped handler is not requested', () => {
    const fallbackUndoHandler = jest.fn();
    const hotkeysManager = {
      keyHandlerMap: {
        [ShortcutKeys[Shortcuts.UNDO]]: fallbackUndoHandler,
      },
    };

    const handler = resolveContentEditShortcutHandler(Shortcuts.UNDO, hotkeysManager, getState);
    const event = { preventDefault: jest.fn(), target: {} };
    handler(event);

    expect(fallbackUndoHandler).toHaveBeenCalledWith(event);
  });
});
