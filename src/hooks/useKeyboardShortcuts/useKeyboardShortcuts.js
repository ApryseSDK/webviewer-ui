import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import {
  EditorModes,
  Shortcuts,
  getContentEditShortcutKeyMap,
  SpreadsheetShortcutKeyMap,
  SHORTCUT_CONFIGS,
} from 'helpers/hotkeysUtils';
import { filterOutDisabledToolShortcuts, filterViewOnlyShortcuts } from './utils';

const contentEditDescriptionMap = {
  [Shortcuts.COPY]: 'option.settings.contentEdit.copyText',
  [Shortcuts.CUT]: 'option.settings.contentEdit.cutText',
  [Shortcuts.PASTE]: 'option.settings.contentEdit.pasteText',
  [Shortcuts.UNDO]: 'option.settings.contentEdit.undoChange',
  [Shortcuts.REDO]: 'option.settings.contentEdit.redoChange',
};

const useKeyboardShortcuts = (editorMode) => {
  const shortcutKeyMap = useSelector(selectors.getShortcutKeyMap);
  const isViewOnly = useSelector(selectors.isViewOnly);
  const isContentEditingEnabled = useSelector(selectors.isContentEditingEnabled);
  const disabledToolNames = useSelector(selectors.getDisabledToolNames);

  const keyboardShortcuts = useMemo(() => {
    const baseShortcuts = SHORTCUT_CONFIGS[editorMode] || SHORTCUT_CONFIGS[EditorModes.DEFAULT];

    const scopedShortcuts = baseShortcuts.map(([shortcut, description]) => {
      if (editorMode === EditorModes.DEFAULT && isContentEditingEnabled && contentEditDescriptionMap[shortcut]) {
        return [shortcut, contentEditDescriptionMap[shortcut]];
      }

      return [shortcut, description];
    });

    let filteredShortcuts = isViewOnly
      ? filterViewOnlyShortcuts(scopedShortcuts, shortcutKeyMap)
      : scopedShortcuts;

    filteredShortcuts = filterOutDisabledToolShortcuts(filteredShortcuts, disabledToolNames);

    return filteredShortcuts;
  }, [editorMode, isViewOnly, shortcutKeyMap, isContentEditingEnabled, disabledToolNames]);

  let effectiveShortcutKeyMap;
  switch (editorMode) {
    case EditorModes.SPREADSHEET:
      effectiveShortcutKeyMap = SpreadsheetShortcutKeyMap;
      break;
    case EditorModes.CONTENT_EDIT:
      effectiveShortcutKeyMap = { ...shortcutKeyMap };
      Object.entries(getContentEditShortcutKeyMap(shortcutKeyMap)).forEach(([shortcut, keyBinding]) => {
        if (keyBinding !== undefined) {
          effectiveShortcutKeyMap[shortcut] = keyBinding;
        }
      });
      break;
    case EditorModes.DEFAULT:
    default:
      effectiveShortcutKeyMap = shortcutKeyMap;
  }

  return { keyboardShortcuts, shortcutKeyMap: effectiveShortcutKeyMap };
};

export default useKeyboardShortcuts;