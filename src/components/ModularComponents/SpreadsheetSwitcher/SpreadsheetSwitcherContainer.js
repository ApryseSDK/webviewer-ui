import React, { useState, useEffect, useCallback } from 'react';
import core from 'core';
import SpreadsheetSwitcher from './SpreadsheetSwitcher';
import useOnDocumentUnloaded from 'hooks/useOnDocumentUnloaded';

function SpreadsheetSwitcherContainer(props) {
  const [workbook, setWorkbook] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  const getSheetsFromWorkbook = (workbookInstance) => {
    let sheetCount = workbookInstance.sheetCount;
    const sheetArray = [];
    for (let i = 0; i < sheetCount; i++) {
      const sheet = workbookInstance.getSheetAt(i);
      sheetArray.push({ name: sheet.name, sheetIndex: i });
    }
    return sheetArray;
  };

  useEffect(() => {
    const documentViewer = core.getDocumentViewer();

    const onSpreadsheetEditorSheetChanged = (event) => {
      const doc = documentViewer.getDocument().getSpreadsheetEditorDocument();
      const workbookInstance = doc.getWorkbook();

      setWorkbook(workbookInstance);
      setSheets(getSheetsFromWorkbook(workbookInstance));
      setActiveSheetIndex(event.getSheetIndex());
    };

    core.addEventListener('activeSheetChanged', onSpreadsheetEditorSheetChanged);
    return () => {
      core.removeEventListener('activeSheetChanged', onSpreadsheetEditorSheetChanged);
    };
  }, []);

  const handleDocumentUnloaded = useCallback(() => {
    setSheets([]);
    setActiveSheetIndex(0);
  }, []);
  useOnDocumentUnloaded(handleDocumentUnloaded);

  const ownProps = {
    ...props,
    tabs: sheets,
    activeSheetIndex,
    setActiveSheet: (name, index) => {
      if (workbook.getSheetAt(index)) {
        workbook.setActiveSheet(index);
        setActiveSheetIndex(index);
      }
    }
  };

  return (<SpreadsheetSwitcher {...ownProps} />);
}

SpreadsheetSwitcherContainer.propTypes = { };

export default SpreadsheetSwitcherContainer;