import { useEffect, useState } from 'react';
import useCore from 'hooks/useCore';

/**
 * Tracks the workbook's active sheet index while in Spreadsheet Editor mode.
 * @param {boolean} isSpreadsheetEditorMode Whether the viewer is currently in Spreadsheet Editor mode.
 * @returns {number} The active sheet index. Stays 0 when not in Spreadsheet Editor mode or before
 * the spreadsheet editor manager has become available.
 * @ignore
 */
const useSpreadsheetActiveSheetIndex = (isSpreadsheetEditorMode) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const { core } = useCore();

  useEffect(() => {
    if (!isSpreadsheetEditorMode) {
      return;
    }

    const spreadsheetEditorManager = core.getDocumentViewer()?.getSpreadsheetEditorManager();
    if (!spreadsheetEditorManager) {
      return;
    }

    const updateActiveSheetIndex = () => {
      const workbook = spreadsheetEditorManager.getWorkbook();
      if (workbook) {
        setActiveSheetIndex(workbook.activeSheetIndex);
      }
    };
    const onActiveSheetChanged = (event) => setActiveSheetIndex(event.getSheetIndex());

    updateActiveSheetIndex();
    core.addEventListener('activeSheetChanged', onActiveSheetChanged);
    core.addEventListener('spreadsheetEditorReady', updateActiveSheetIndex);

    return () => {
      core.removeEventListener('activeSheetChanged', onActiveSheetChanged);
      core.removeEventListener('spreadsheetEditorReady', updateActiveSheetIndex);
    };
  }, [isSpreadsheetEditorMode, core]);

  return activeSheetIndex;
};

export default useSpreadsheetActiveSheetIndex;
