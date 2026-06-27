import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useCore from 'hooks/useCore';
import SpreadsheetSwitcher from './SpreadsheetSwitcher';
import useOnDocumentUnloaded from 'hooks/useOnDocumentUnloaded';
import { useTranslation } from 'react-i18next';
import useFocusOnClose from 'src/hooks/useFocusOnClose';
import { isSheetNameDuplicated } from 'helpers/spreadsheetSwitchContainerHelpers';
import actions from 'actions';

const ERROR = 'SpreadsheetEditorDocument is not loaded';
let NEW_SPREADSHEET_NUMBER = 1;

function SpreadsheetSwitcherContainer(props) {
  const { core } = useCore();
  const dispatch = useDispatch();
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
    const refreshUndoRedoState = () => {
      const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
      const spreadsheetEditorHistoryManager = spreadsheetEditorManager.getSpreadsheetEditorHistoryManager();
      dispatch(actions.setSpreadsheetEditorCanUndo(spreadsheetEditorHistoryManager.canUndo()));
      dispatch(actions.setSpreadsheetEditorCanRedo(spreadsheetEditorHistoryManager.canRedo()));
    };

    const onSpreadsheetEditorSheetStateChanged = (event) => {
      setSheets(event.getVisibleSheets());
      setActiveSheetIndex(event.getActiveSheetIndex());
      refreshUndoRedoState();
    };

    const onSpreadsheetEditorSheetChanged = (event) => {
      setActiveSheetIndex(event.getSheetIndex());
    };

    const onSpreadsheetEditorReady = () => {
      const documentViewer = core.getDocumentViewer();
      const spreadsheetEditorManager = documentViewer.getSpreadsheetEditorManager();
      const workbookInstance = spreadsheetEditorManager.getWorkbook();
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
  }, [core, dispatch]);

  const handleDocumentUnloaded = useCallback(() => {
    setSheets([]);
    setActiveSheetIndex(0);
  }, []);
  useOnDocumentUnloaded(handleDocumentUnloaded);

  const setActiveSheet = (name, index) => {
    const workbook = core.getDocumentViewer().getSpreadsheetEditorManager()?.getWorkbook();
    if (!workbook) {
      return console.error(ERROR);
    }

    if (workbook.getSheetAt(index)) {
      workbook.setActiveSheet(index);
      setActiveSheetIndex(index);
    }
  };

  const createNewSheet = () => {
    const workbook = core.getDocumentViewer().getSpreadsheetEditorManager()?.getWorkbook();
    if (!workbook) {
      return console.error(ERROR);
    }

    while (workbook.getSheet(`${t('spreadsheetEditor.blankSheet')}${NEW_SPREADSHEET_NUMBER}`)) {
      NEW_SPREADSHEET_NUMBER++;
    }
    const newName = `${t('spreadsheetEditor.blankSheet')}${NEW_SPREADSHEET_NUMBER}`;
    workbook.createSheet(newName);
  };

  const deleteSheet = useFocusOnClose((name) => {
    const workbook = core.getDocumentViewer().getSpreadsheetEditorManager()?.getWorkbook();
    if (!workbook) {
      return console.error(ERROR);
    }

    if (workbook.getSheet(name)) {
      workbook.removeSheet(name);
    }
  }, 'addTabButton');

  const renameSheet = (oldName, newName) => {
    const workbook = core.getDocumentViewer().getSpreadsheetEditorManager()?.getWorkbook();
    if (!workbook) {
      return console.error(ERROR);
    }

    const sheet = workbook.getSheet(oldName);
    if (sheet) {
      sheet.name = newName;
    }
  };

  const checkIsSheetNameDuplicated = (newName) => {
    const workbook = core.getDocumentViewer().getSpreadsheetEditorManager()?.getWorkbook();
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