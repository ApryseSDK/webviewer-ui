import core from 'core';
import selectors from 'selectors';
import { ShortcutKeys, Shortcuts, resolveShortcutByKeyCombo } from './hotkeysUtils';

export const CONTENT_EDIT_STYLE_SHORTCUTS = [
  Shortcuts.CONTENT_EDIT_BOLD,
  Shortcuts.CONTENT_EDIT_ITALIC,
  Shortcuts.CONTENT_EDIT_UNDERLINE,
  Shortcuts.CONTENT_EDIT_STRIKEOUT,
];

const CONTENT_EDIT_STYLE_SHORTCUTS_SET = new Set(CONTENT_EDIT_STYLE_SHORTCUTS);

const CONTENT_EDIT_TOGGLE_METHOD_BY_SHORTCUT = {
  [Shortcuts.CONTENT_EDIT_BOLD]: 'toggleBoldContents',
  [Shortcuts.CONTENT_EDIT_ITALIC]: 'toggleItalicContents',
  [Shortcuts.CONTENT_EDIT_UNDERLINE]: 'toggleUnderlineContents',
  [Shortcuts.CONTENT_EDIT_STRIKEOUT]: 'toggleStrikeContents',
};

const CONTENT_EDIT_HISTORY_METHOD_BY_SHORTCUT = {
  [Shortcuts.UNDO]: 'undo',
  [Shortcuts.REDO]: 'redo',
};

const getActiveContentEditAnnotation = (getState) => {
  const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
  const contentEditManager = core.getContentEditManager(activeDocumentViewerKey);
  const activeContentBox = contentEditManager?.getActiveEditingContentBox?.();
  const activeAnnotation = activeContentBox?.getPlaceholderAnnotation?.();
  if (activeAnnotation) {
    return activeAnnotation;
  }

  const selectedAnnotation = core.getSelectedAnnotations(activeDocumentViewerKey)?.[0];
  return selectedAnnotation?.isContentEditPlaceholder?.() ? selectedAnnotation : null;
};

const invokeHotkeyHandler = (handler, event) => {
  if (typeof handler === 'function') {
    handler(event);
    return;
  }

  if (handler && typeof handler.keydown === 'function') {
    handler.keydown(event);
  }
};

const getKeyCombosFromKeyboardEvent = (event) => {
  const key = event?.key?.toLowerCase();
  const isSingleCharacter = typeof key === 'string' && key.length === 1;
  if (!isSingleCharacter) {
    return [];
  }

  const combos = [];
  if (event.ctrlKey) {
    combos.push(`ctrl+${key}`);
  }
  if (event.metaKey) {
    combos.push(`command+${key}`);
  }
  return combos;
};

export const isContentEditStyleShortcut = (shortcut) => CONTENT_EDIT_STYLE_SHORTCUTS_SET.has(shortcut);

export const getContentEditStyleShortcutHandler = (shortcut, getState) => {
  const toggleMethodName = CONTENT_EDIT_TOGGLE_METHOD_BY_SHORTCUT[shortcut];
  if (!toggleMethodName) {
    return undefined;
  }

  return (event) => {
    const isContentEditingEnabled = selectors.isContentEditingEnabled(getState());
    if (!isContentEditingEnabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation?.();

    const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
    const annotation = getActiveContentEditAnnotation(getState);
    if (!annotation) {
      return;
    }

    const contentEditManager = core.getContentEditManager(activeDocumentViewerKey);
    if (!contentEditManager || typeof contentEditManager[toggleMethodName] !== 'function') {
      return;
    }

    contentEditManager[toggleMethodName](annotation);
  };
};

/**
 * Checks whether a node is a text-entry element that owns its own undo stack.
 * @param {Node} node The node to test.
 * @returns {boolean} `true` if the node is an input, textarea, select, or contenteditable.
 * @ignore
 */
const isTextEntryElement = (node) => {
  if (node?.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const tagName = node.tagName;
  return node.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT' ||
    node.getAttribute?.('role') === 'textbox';
};

/**
 * Checks whether a keyboard event should be left to a native text-entry undo stack.
 * @param {KeyboardEvent} event The keyboard event to check.
 * @param {Element} viewerElement The active viewer element, used to identify text entry
 *   that belongs to Content Edit rather than to unrelated UI.
 * @returns {boolean} `true` if the event targets a text-entry element outside the viewer.
 * @remarks Walks `composedPath()` so the check works in WebComponent (shadow DOM) mode,
 *   where `event.target` is retargeted to the shadow host and inspecting `event.target`
 *   alone would misclassify inputs that live inside a shadow root.
 *
 *   Text entry inside the viewer element is deliberately *not* excluded: a content box's
 *   own editable surface should still route undo/redo to the `ContentEditManager`.
 * @ignore
 */
const isEventFromExternalTextEntry = (event, viewerElement) => {
  const eventPath = typeof event?.composedPath === 'function' ? event.composedPath() : [];
  const nodes = eventPath.length > 0 ? eventPath : [event?.target];

  return nodes.some((node) => isTextEntryElement(node) && !viewerElement?.contains?.(node));
};

/**
 * Creates a scoped keyboard shortcut handler for Content Edit undo/redo.
 * @param {string} shortcut The shortcut identifier (e.g. `Shortcuts.UNDO` or `Shortcuts.REDO`).
 * @param {object} hotkeysManager The hotkeys manager instance (used for fallback resolution).
 * @param {function} getState The Redux store's `getState` function.
 * @returns {function|undefined} A keydown handler that delegates to the active
 *   document viewer's `ContentEditManager.undo()` / `redo()`, or `undefined` if
 *   the shortcut is not an undo/redo shortcut.
 * @remarks Routes to `getContentEditManager()` (which executes the full
 *   undo/redo command) rather than `getContentEditHistoryManager()` (which only
 *   pops the history stack without executing the command).
 *
 *   Scoping is by content-editing mode, not by event origin or current selection.
 *   Content Edit undo/redo is a document-level history stack owned by the mode, so it
 *   must keep working after the edited content box is gone — for example after deleting
 *   text through the context popup menu, after clicking the style panel, or when focus
 *   has fallen back to `document.body`. Requiring the event to originate inside the
 *   viewer element broke all three cases. The only competing claim on these shortcuts is
 *   a real text-entry field outside the viewer, which is excluded explicitly.
 * @ignore
 */
const getContentEditHistoryShortcutHandler = (shortcut, hotkeysManager, getState) => {
  const historyMethodName = CONTENT_EDIT_HISTORY_METHOD_BY_SHORTCUT[shortcut];
  if (!historyMethodName) {
    return undefined;
  }

  return (event) => {
    const isContentEditingEnabled = selectors.isContentEditingEnabled(getState());
    if (!isContentEditingEnabled) {
      return;
    }

    const activeDocumentViewerKey = selectors.getActiveDocumentViewerKey(getState());
    const documentViewer = core.getDocumentViewer(activeDocumentViewerKey);
    const viewerElement = documentViewer?.getViewerElement?.();
    if (isEventFromExternalTextEntry(event, viewerElement)) {
      return;
    }

    event.preventDefault();
    documentViewer?.getContentEditManager?.()?.[historyMethodName]?.();
  };
};

export const resolveContentEditShortcutHandler = (shortcut, hotkeysManager, getState, includeSharedContentEditHandlers = false) => {
  const styleHandler = getContentEditStyleShortcutHandler(shortcut, getState);
  if (styleHandler) {
    return styleHandler;
  }

  if (includeSharedContentEditHandlers) {
    const historyHandler = getContentEditHistoryShortcutHandler(shortcut, hotkeysManager, getState);
    if (historyHandler) {
      return historyHandler;
    }
  }

  return hotkeysManager.keyHandlerMap?.[ShortcutKeys[shortcut]];
};

export const createContentEditStyleBridgeHandler = ({ getState, shortcutKeyMapResolver, hotkeysManager }) => (event) => {
  if (!selectors.isContentEditingEnabled(getState())) {
    return;
  }

  const contentEditShortcutKeyMap = shortcutKeyMapResolver();
  const matchingShortcut = getKeyCombosFromKeyboardEvent(event)
    .map((keyCombo) => resolveShortcutByKeyCombo(keyCombo, contentEditShortcutKeyMap))
    .find((shortcut) => isContentEditStyleShortcut(shortcut));

  if (!matchingShortcut) {
    return;
  }

  const handler = resolveContentEditShortcutHandler(matchingShortcut, hotkeysManager, getState, true);
  if (!handler) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  invokeHotkeyHandler(handler, event);
};
