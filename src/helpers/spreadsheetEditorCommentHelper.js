import {
  SPREADSHEET_SHEET_INDEX_KEY,
  SPREADSHEET_CELL_KEY,
} from 'constants/spreadsheetEditor';

const deleteSpreadsheetEditorComment = async ({
  annotation,
  core,
}) => {
  if (!annotation) {
    console.warn('Missing annotation for spreadsheet editor comment deletion');
    return;
  }
  const commentId = annotation.Id;
  if (!commentId) {
    return;
  }
  try {
    await core.getDocumentViewer().getSpreadsheetEditorManager().getCommentManager().deleteComment(commentId);
  } catch (error) {
    console.warn(`Failed to delete spreadsheet editor comment (id: ${commentId})`, error);
  }
};

const navigateToSpreadsheetComment = ({ comment, core, documentViewerKey }) => {
  const documentViewer = core.getDocumentViewer(documentViewerKey);
  const spreadsheetEditorManager = documentViewer?.getSpreadsheetEditorManager();
  const workbook = spreadsheetEditorManager?.getWorkbook();
  const sheetIndex = Number(comment.getCustomData(SPREADSHEET_SHEET_INDEX_KEY));
  const cell = comment.getCustomData(SPREADSHEET_CELL_KEY);

  if (!spreadsheetEditorManager || !workbook || !Number.isInteger(sheetIndex) || sheetIndex < 0 || !cell || !workbook.getSheetAt(sheetIndex)) {
    console.warn(`Failed to navigate to spreadsheet editor comment (id: ${comment.Id}) due to invalid sheet or cell data`);
    return;
  }

  if (workbook.activeSheetIndex !== sheetIndex) {
    workbook.setActiveSheet(sheetIndex);
  }

  spreadsheetEditorManager.selectCellRange(core.getCellRange(cell));
};

export { deleteSpreadsheetEditorComment, navigateToSpreadsheetComment };
