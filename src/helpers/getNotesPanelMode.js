import { NotesPanelMode } from 'constants/notesPanelModeStrategies';

/**
 * Resolves the NotesPanel mode from the active editor flags.
 * @ignore
 * @param {object} flags
 * @param {boolean} [flags.isOfficeEditorMode]
 * @param {boolean} [flags.isSpreadsheetEditorMode]
 * @returns {string} One of the NotesPanelMode values.
 */
const getNotesPanelMode = ({ isOfficeEditorMode, isSpreadsheetEditorMode } = {}) => {
  if (isSpreadsheetEditorMode) {
    return NotesPanelMode.SPREADSHEET;
  }
  if (isOfficeEditorMode) {
    return NotesPanelMode.OFFICE_EDITOR;
  }
  return NotesPanelMode.DEFAULT;
};

export default getNotesPanelMode;
