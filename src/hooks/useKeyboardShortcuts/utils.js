import {
  getViewOnlyShortcuts,
  isShortcutInToolList
} from 'helpers/hotkeysManager';
export const filterOutDisabledToolShortcuts = (shortcuts, disabledToolNames) => {
  if (disabledToolNames.length === 0) {
    return shortcuts;
  }

  return shortcuts.filter(([shortcut]) =>
    !isShortcutInToolList(shortcut, disabledToolNames)
  );
};


export const filterViewOnlyShortcuts = (shortcuts, shortcutKeyMap) => {
  const viewOnlyShortcuts = getViewOnlyShortcuts();
  return shortcuts.filter(([shortcut]) =>
    viewOnlyShortcuts.includes(shortcut) && shortcutKeyMap[shortcut]
  );
};