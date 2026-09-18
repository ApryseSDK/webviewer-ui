import core from 'core';
import { workerTypes } from 'constants/types';

export function isSpreadsheetEditorMode() {
  return core.getDocument()?.getType() === workerTypes.SPREADSHEET_EDITOR;
}