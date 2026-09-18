const updateSpreadsheetEditorCommentMessage = ({
  annotation,
  text,
  core,
}) => {
  if (!annotation) {
    console.warn('Missing comment Id for spreadsheet editor comment update');
    return false;
  }

  const commentId = annotation.Id;
  if (!commentId) {
    console.warn('Missing comment Id for spreadsheet editor comment update');
    return false;
  }

  try {
    core.getDocumentViewer().getSpreadsheetEditorManager().getCommentManager().setCommentMessage(commentId, text);
    return true;
  } catch (error) {
    console.warn(`Failed to update spreadsheet editor comment message (id: ${commentId})`, error);
    return false;
  }
};

export default updateSpreadsheetEditorCommentMessage;
