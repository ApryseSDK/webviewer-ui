import core from 'core';
import { workerTypes } from 'constants/types';

export function isOfficeEditorMode() {
  return core.getDocument()?.getType() === workerTypes.OFFICE_EDITOR;
}
