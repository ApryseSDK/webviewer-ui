import core from 'core';

function performClipboardActionOnCells(actionType) {
  if (!actionType) {
    return;
  }

  const clipboard = core.getDocumentViewer().getSpreadsheetEditorManager().getSpreadsheetEditorClipboard();
  if (!clipboard) {
    return;
  }

  switch (actionType) {
    case 'copy':
      clipboard.copy();
      break;
    case 'paste':
      clipboard.paste();
      break;
    case 'cut':
      clipboard.cut();
      break;
    default:
      break;
  }
}

export default performClipboardActionOnCells;