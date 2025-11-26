import React, { useState, useEffect, useCallback } from 'react';
import core from 'core';
import SpreadsheetSwitcher from './SpreadsheetSwitcher';
import useOnDocumentUnloaded from 'hooks/useOnDocumentUnloaded';
import { useTranslation } from 'react-i18next';
import useFocusOnClose from 'src/hooks/useFocusOnClose';
import { isSheetNameDuplicated } from 'helpers/spreadsheetSwitchContainerHelpers';

const ERROR = 'SpreadsheetEditorDocument is not loaded';
let NEW_SPREADSHEET_NUMBER = 2;

function SpreadsheetSwitcherContainer(props) {
  const { t } = useTranslation();
  const [sheets, setSheets] = useState([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  const getVisibleSheetsFromWorkbook = (workbookInstance) => {
    let sheetCount = workbookInstance.sheetCount;
    const sheetArray = [];
    for (let i = 0; i < sheetCount; i++) {
      const sheet = workbookInstance.getSheetAt(i);
      if (workbookInstance.isSheetHidden(sheet.name)) {
        continue;
      }
      sheetArray.push({ name: sheet.name, sheetIndex: i });
    }
    return sheetArray;
  };

  useEffect(() => {
    const onSpreadsheetEditorSheetStateChanged = (event) => {
      setSheets(event.getVisibleSheets());
      setActiveSheetIndex(event.getActiveSheetIndex());
    };

    const onSpreadsheetEditorSheetChanged = (event) => {
      setActiveSheetIndex(event.getSheetIndex());
    };

    const onSpreadsheetEditorReady = () => {
      const documentViewer = core.getDocumentViewer();
      const doc = documentViewer.getDocument().getSpreadsheetEditorDocument();
      const workbookInstance = doc.getWorkbook();
      if (workbookInstance) {
        setSheets(getVisibleSheetsFromWorkbook(workbookInstance));
      }
    };

    core.addEventListener('activeSheetChanged', onSpreadsheetEditorSheetChanged);
    core.addEventListener('spreadsheetEditorReady', onSpreadsheetEditorReady);
    core.addEventListener('sheetChanged', onSpreadsheetEditorSheetStateChanged);
    return () => {
      core.removeEventListener('sheetChanged', onSpreadsheetEditorSheetStateChanged);
      core.removeEventListener('spreadsheetEditorReady', onSpreadsheetEditorReady);
      core.removeEventListener('activeSheetChanged', onSpreadsheetEditorSheetChanged);
    };
  }, []);

  const handleDocumentUnloaded = useCallback(() => {
    setSheets([]);
    setActiveSheetIndex(0);
  }, []);
  useOnDocumentUnloaded(handleDocumentUnloaded);

  const setActiveSheet = (name, index) => {
    const workbook = core.getDocument()?.getSpreadsheetEditorDocument()?.getWorkbook();
    if (!workbook) {
      return console.error(ERROR);
    }

    if (workbook.getSheetAt(index)) {
      workbook.setActiveSheet(index);
      setActiveSheetIndex(index);
    }
  };

  const createNewSheet = () => {
    const workbook = core.getDocument()?.getSpreadsheetEditorDocument()?.getWorkbook();
    if (!workbook) {
      return console.error(ERROR);
    }

    let newName = t('spreadsheetEditor.blankSheet');
    let isNameUnique = !workbook.getSheet(newName);
    while (!isNameUnique) {
      newName = `${t('spreadsheetEditor.blankSheet')} ${NEW_SPREADSHEET_NUMBER++}`;
      isNameUnique = !workbook.getSheet(newName);
    }
    workbook.createSheet(newName);
  };

  const deleteSheet = useFocusOnClose((name) => {
    const workbook = core.getDocument()?.getSpreadsheetEditorDocument()?.getWorkbook();
    if (!workbook) {
      return console.error(ERROR);
    }

    if (workbook.getSheet(name)) {
      workbook.removeSheet(name);
    }
  }, 'addTabButton');

  const renameSheet = (oldName, newName) => {
    const workbook = core.getDocument()?.getSpreadsheetEditorDocument()?.getWorkbook();
    if (!workbook) {
      return console.error(ERROR);
    }

    const sheet = workbook.getSheet(oldName);
    if (sheet) {
      sheet.name = newName;
    }
  };

  const checkIsSheetNameDuplicated = (newName) => {
    const workbook = core.getDocument()?.getSpreadsheetEditorDocument()?.getWorkbook();
    if (!workbook) {
      console.error(ERROR);
      return false;
    }

    return isSheetNameDuplicated(
      sheets,
      sheets[activeSheetIndex],
      newName
    );
  };

  const ownProps = {
    ...props,
    tabs: sheets,
    activeSheetIndex,
    setActiveSheet,
    createNewSheet,
    deleteSheet,
    renameSheet,
    checkIsSheetNameDuplicated
  };

  return (<SpreadsheetSwitcher {...ownProps} />);
}

SpreadsheetSwitcherContainer.propTypes = { };

export default SpreadsheetSwitcherContainer;