import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { EditorModes, SpreadsheetShortcutKeyMap, SHORTCUT_CONFIGS } from 'helpers/hotkeysManager';

const useKeyboardShortcuts = (editorMode) => {
  const shortcutKeyMap = useSelector(selectors.getShortcutKeyMap);

  const keyboardShortcuts = useMemo(() => {
    return SHORTCUT_CONFIGS[editorMode] || SHORTCUT_CONFIGS[EditorModes.DEFAULT];
  }, [editorMode]);

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