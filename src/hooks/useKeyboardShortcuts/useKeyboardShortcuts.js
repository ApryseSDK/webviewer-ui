import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import {
  EditorModes,
  SpreadsheetShortcutKeyMap,
  SHORTCUT_CONFIGS,
} from 'helpers/hotkeysManager';
import { filterOutDisabledToolShortcuts, filterViewOnlyShortcuts } from './utils';

const useKeyboardShortcuts = (editorMode) => {
  const shortcutKeyMap = useSelector(selectors.getShortcutKeyMap);
  const isViewOnly = useSelector(selectors.isViewOnly);
  const disabledToolNames = useSelector(selectors.getDisabledToolNames);

  const keyboardShortcuts = useMemo(() => {
    const baseShortcuts = SHORTCUT_CONFIGS[editorMode] || SHORTCUT_CONFIGS[EditorModes.DEFAULT];

    let filteredShortcuts = isViewOnly
      ? filterViewOnlyShortcuts(baseShortcuts, shortcutKeyMap)
      : baseShortcuts;

    filteredShortcuts = filterOutDisabledToolShortcuts(filteredShortcuts, disabledToolNames);

    return filteredShortcuts;
  }, [editorMode, isViewOnly, shortcutKeyMap, disabledToolNames]);

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