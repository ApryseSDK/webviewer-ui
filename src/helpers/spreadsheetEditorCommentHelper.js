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

export { deleteSpreadsheetEditorComment };
