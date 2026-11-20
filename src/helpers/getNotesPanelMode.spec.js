import getNotesPanelMode from 'helpers/getNotesPanelMode';
import { NotesPanelMode } from 'constants/notesPanelModeStrategies';

describe('getNotesPanelMode', () => {
  it('should return default when no editor flag is set', () => {
    expect(getNotesPanelMode()).toBe(NotesPanelMode.DEFAULT);
    expect(getNotesPanelMode({ isOfficeEditorMode: false, isSpreadsheetEditorMode: false })).toBe(NotesPanelMode.DEFAULT);
  });

  it('should return officeEditor for office editor mode', () => {
    expect(getNotesPanelMode({ isOfficeEditorMode: true })).toBe(NotesPanelMode.OFFICE_EDITOR);
  });

  it('should return spreadsheet for spreadsheet editor mode', () => {
    expect(getNotesPanelMode({ isSpreadsheetEditorMode: true })).toBe(NotesPanelMode.SPREADSHEET);
  });

  it('should prefer spreadsheet if both flags are set', () => {
    expect(getNotesPanelMode({ isOfficeEditorMode: true, isSpreadsheetEditorMode: true })).toBe(NotesPanelMode.SPREADSHEET);
  });
});
