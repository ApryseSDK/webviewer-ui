import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { EditorModes, SpreadsheetShortcutKeyMap, SHORTCUT_CONFIGS, getViewOnlyShortcuts } from 'helpers/hotkeysManager';

const useKeyboardShortcuts = (editorMode) => {
  const shortcutKeyMap = useSelector(selectors.getShortcutKeyMap);
  const isViewOnly = useSelector(selectors.isViewOnly);

  const keyboardShortcuts = useMemo(() => {
    if (!isViewOnly) {
      return SHORTCUT_CONFIGS[editorMode] || SHORTCUT_CONFIGS[EditorModes.DEFAULT];
    }

    const shortcuts = SHORTCUT_CONFIGS[editorMode] || SHORTCUT_CONFIGS[EditorModes.DEFAULT];
    return shortcuts.filter(([shortcut]) => {
      return getViewOnlyShortcuts().includes(shortcut) && shortcutKeyMap[shortcut];
    });
  }, [editorMode, isViewOnly, shortcutKeyMap]);

  let effectiveShortcutKeyMap;
  switch (editorMode) {
    case EditorModes.SPREADSHEET:
      effectiveShortcutKeyMap = SpreadsheetShortcutKeyMap;
      break;
    case EditorModes.DEFAULT:
    default:
      effectiveShortcutKeyMap = shortcutKeyMap;
  }

  return { keyboardShortcuts, shortcutKeyMap: effectiveShortcutKeyMap };
};

export default useKeyboardShortcuts;