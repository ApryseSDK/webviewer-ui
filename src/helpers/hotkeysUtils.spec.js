import {
  getContentEditShortcutKeyMap,
  Keys,
  Shortcuts,
  concatKeys,
} from './hotkeysUtils';

describe('hotkeysUtils content edit shortcut map', () => {
  it('falls back to default copy/paste/undo/redo shortcuts when missing in user map', () => {
    const map = getContentEditShortcutKeyMap({});

    expect(map[Shortcuts.COPY]).toBe(concatKeys(Keys.CTRL_C, Keys.COMMAND_C));
    expect(map[Shortcuts.PASTE]).toBe(concatKeys(Keys.CTRL_V, Keys.COMMAND_V));
    expect(map[Shortcuts.UNDO]).toBe(concatKeys(Keys.CTRL_Z, Keys.COMMAND_Z));
    expect(map[Shortcuts.REDO]).toBe(concatKeys(Keys.CTRL_Y, Keys.COMMAND_SHIFT_Z));
  });

  it('uses shared shortcut overrides from the user shortcut map', () => {
    const map = getContentEditShortcutKeyMap({
      [Shortcuts.COPY]: 'ctrl+shift+c',
      [Shortcuts.REDO]: 'ctrl+shift+r',
    });

    expect(map[Shortcuts.COPY]).toBe('ctrl+shift+c');
    expect(map[Shortcuts.REDO]).toBe('ctrl+shift+r');
  });

  it('always uses default content edit style shortcuts', () => {
    const map = getContentEditShortcutKeyMap({
      [Shortcuts.CONTENT_EDIT_BOLD]: 'ctrl+shift+b',
      [Shortcuts.CONTENT_EDIT_ITALIC]: 'ctrl+shift+i',
    });

    expect(map[Shortcuts.CONTENT_EDIT_BOLD]).toBe(concatKeys(Keys.CTRL_B, Keys.COMMAND_B));
    expect(map[Shortcuts.CONTENT_EDIT_ITALIC]).toBe(concatKeys(Keys.CTRL_I, Keys.COMMAND_I));
    expect(map[Shortcuts.CONTENT_EDIT_UNDERLINE]).toBe(concatKeys(Keys.CTRL_U, Keys.COMMAND_U));
    expect(map[Shortcuts.CONTENT_EDIT_STRIKEOUT]).toBe(concatKeys(Keys.CTRL_K, Keys.COMMAND_K));
  });
});
