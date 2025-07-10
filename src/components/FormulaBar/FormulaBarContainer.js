import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import FormulaBar from './FormulaBar';
import core from 'core';

const EDIT_MODE = window.Core.SpreadsheetEditor.SpreadsheetEditorEditMode;

export const FormulaBarContainer = () => {
  // This component can pull all Redux state and call any core methods
  const activeCellRange = useSelector(selectors.getActiveCellRange);
  const cellFormula = useSelector(selectors.getCellFormula);
  const stringCellValue = useSelector(selectors.getStringCellValue);
  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const isReadOnlyMode = spreadsheetEditorEditMode === EDIT_MODE.VIEW_ONLY;

  const [rangeInputValue, setRangeInputValue] = useState(activeCellRange);

  const onRangeInputChange = (value) => {
    setRangeInputValue(value);
  };

  const onRangeInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      try {
        const documentViewer = core.getDocumentViewer();
        const spreadsheetEditorDocument = documentViewer.getDocument().getSpreadsheetEditorDocument();
        const cellRange = core.getCellRange(event.target.value);
        spreadsheetEditorDocument.selectCellRange(cellRange);
      } catch (e) {
        setRangeInputValue(activeCellRange);
        console.error(e);
        return;
      }
    }
  };

  useEffect(() => {
    setRangeInputValue(activeCellRange);
  }, [activeCellRange]);

  return (
    <FormulaBar
      isReadOnly={isReadOnlyMode}
      activeCellRange={rangeInputValue}
      cellFormula={cellFormula}
      stringCellValue={stringCellValue}
      onRangeInputChange={onRangeInputChange}
      onRangeInputKeyDown={onRangeInputKeyDown}
    />
  );
};

export default FormulaBarContainer;