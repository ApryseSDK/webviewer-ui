import core from 'core';

const wrapTextMap = {
  'overflow': 1,
  'wrap': 2,
  'clip': 3,
};

const setCellTextWrap = (wrapTextType) => {
  if (!wrapTextType) {
    return;
  }

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  const wrapText = wrapTextMap[wrapTextType];
  spreadsheetEditorManager.setSelectedCellsStyle({
    wrapText,
  });
};

export default setCellTextWrap;