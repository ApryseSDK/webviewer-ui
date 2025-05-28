import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import core from 'core';
import selectors from 'selectors';
import { OfficeEditorEditMode } from 'constants/officeEditor';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';

const useOnDocumentFileNameEdit = () => {
  const isOfficeEditorEnabled = useSelector(selectors.getIsOfficeEditorMode);
  const officeEditMode = useSelector(selectors.getOfficeEditorEditMode);
  const isSpreadsheetEditorEnabled = useSelector(selectors.isSpreadsheetEditorModeEnabled);
  const spreadsheetEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);

  const [isEditing, setIsEditing] = useState(false);
  const [extension, setExtension] = useState('');
  const [fileNameWithoutExtension, setFileNameWithoutExtension] = useState('');
  const [viewOnly, setViewOnly] = useState(false);

  const startEditing = () => {
    const name = core.getDocument()?.getFilename();
    const nameArray = name?.split('.');
    const extension = `.${nameArray.pop()}`;
    setFileNameWithoutExtension(name.slice(0, -extension.length) || name);
    setExtension(extension);
    setIsEditing(true);
  };

  const finishEditing = () => {
    if (fileNameWithoutExtension) {
      core.getDocument()?.setFilename(`${fileNameWithoutExtension}${extension}`);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const isOfficeEditorViewOnly = isOfficeEditorEnabled && officeEditMode === OfficeEditorEditMode.VIEW_ONLY;
    const isSpreadSheetViewOnly = isSpreadsheetEditorEnabled && spreadsheetEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;
    setViewOnly(isOfficeEditorViewOnly || isSpreadSheetViewOnly);
  }, [isOfficeEditorEnabled, officeEditMode, isSpreadsheetEditorEnabled, spreadsheetEditMode]);

  return {
    viewOnly,
    extension,
    isEditing,
    fileNameWithoutExtension,
    setFileNameWithoutExtension,
    startEditing,
    finishEditing,
    handleKeyDown,
  };
};

export default useOnDocumentFileNameEdit;
