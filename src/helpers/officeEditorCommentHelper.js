import { OFFICE_EDITOR_COMMENT_KEY } from 'constants/officeEditor';

export const parseRecordId = (value) => {
  if (!value) {
    return null;
  }
  const id = Number(value);
  if (Number.isNaN(id)) {
    console.warn(`Invalid annotation id value: ${value}`);
    return null;
  }

  return id;
};

const updateOfficeEditorCommentMessage = async ({
  annotation,
  text,
  core,
}) => {
  if (!annotation) {
    console.warn('Missing annotation for office editor comment update');
    return false;
  }
  const commentId = parseRecordId(annotation.getCustomData(OFFICE_EDITOR_COMMENT_KEY));
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
  if (!annotation) {
    console.warn('Missing annotation for office editor comment deletion');
    return;
  }
  const commentId = parseRecordId(annotation.getCustomData(OFFICE_EDITOR_COMMENT_KEY));
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
