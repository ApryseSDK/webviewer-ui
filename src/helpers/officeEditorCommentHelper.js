import { OFFICE_EDITOR_COMMENT_KEY } from 'constants/officeEditor';

export const getOfficeEditorCommentId = (annotation) => {
  if (!annotation) {
    console.warn('Failed to resolve office editor comment', new Error('Missing annotation'));
    return null;
  }

  const rawCommentId = annotation.getCustomData(OFFICE_EDITOR_COMMENT_KEY);
  const commentId = Number(rawCommentId);
  if (Number.isNaN(commentId)) {
    console.warn('Invalid office editor comment id', new Error(`Invalid comment id value: ${rawCommentId}`));
    return null;
  }

  return commentId;
};

const updateOfficeEditorCommentMessage = async ({
  annotation,
  text,
  core,
}) => {
  const commentId = getOfficeEditorCommentId(annotation);
  if (commentId === null) {
    return false;
  }

  try {
    await core.getOfficeEditor().getCommentManager().setCommentMessage(commentId, text);
    return true;
  } catch (error) {
    console.warn(`Failed to update office editor comment message (id: ${commentId})`, error);
    return false;
  }
};

const deleteOfficeEditorComment = async ({
  annotation,
  core,
}) => {
  const commentId = getOfficeEditorCommentId(annotation);
  if (commentId === null) {
    return;
  }

  try {
    await core.getOfficeEditor().getCommentManager().deleteComment(commentId);
  } catch (error) {
    console.warn(`Failed to delete office editor comment (id: ${commentId})`, error);
  }
};

export { deleteOfficeEditorComment, updateOfficeEditorCommentMessage };
