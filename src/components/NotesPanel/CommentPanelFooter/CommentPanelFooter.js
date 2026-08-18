import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useCore from 'hooks/useCore';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { EditingStreamType } from 'constants/officeEditor';
import TextButton from 'components/TextButton';

const CommentPanelFooter = ({ dataElement, existingCommentAtSelectedCell }) => {
  const [t] = useTranslation();
  const { core } = useCore();
  const dispatch = useDispatch();
  const activeStream = useSelector(selectors.getOfficeEditorActiveStream);
  const activeCellRange = useSelector(selectors.getActiveCellRange);
  const isOfficeEditorCommentPanel = dataElement === DataElements.OFFICE_EDITOR_COMMENT_PANEL;
  const isSpreadsheetEditorCommentPanel = dataElement === DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL;

  // TODO: Replace this stub with a call to the real Core reply API (CommentManager.addReply)
  // once it is merged.
  const handleAddReplyToExistingComment = useCallback((existingComment) => {
    console.warn('Add reply is not yet implemented; the addReply API has not been merged.', existingComment);
  }, []);

  const handleAddSpreadsheetComment = useCallback(() => {
    if (existingCommentAtSelectedCell) {
      handleAddReplyToExistingComment(existingCommentAtSelectedCell);
      return;
    }

    // When multiple cells are selected, activeCellRange is a range string (e.g. "A1:C3")
    // with the top-left cell listed first, so the comment always lands on the top-left cell.
    const spreadsheetEditorManager = core.getDocumentViewer()?.getSpreadsheetEditorManager();
    const workbook = spreadsheetEditorManager?.getWorkbook();
    const sheetName = workbook?.getSheetAt(workbook.activeSheetIndex)?.name;
    const cellString = activeCellRange?.split(':')[0];
    if (!sheetName || !cellString) {
      return;
    }

    try {
      const commentManager = spreadsheetEditorManager?.getCommentManager?.();
      const comment = commentManager.addComment('', { sheetName, cellString });

      const annotation = core.getAnnotationById(comment.getId());
      if (!annotation) {
        return;
      }
      core.deselectAllAnnotations();
      core.selectAnnotation(annotation);
      dispatch(actions.triggerNoteEditing());
    } catch (error) {
      console.warn('Failed to add comment:', error);
    }
  }, [existingCommentAtSelectedCell, handleAddReplyToExistingComment, activeCellRange, dispatch, core]);

  const handleAddComment = useCallback(() => {
    if (isOfficeEditorCommentPanel) {
      core.getOfficeEditor().getCommentManager().addCommentThreadAtCurrentRange('').catch((error) => {
        console.warn('Failed to add comment thread', error);
      });
    } else if (isSpreadsheetEditorCommentPanel) {
      handleAddSpreadsheetComment();
    }
  }, [isOfficeEditorCommentPanel, isSpreadsheetEditorCommentPanel, handleAddSpreadsheetComment, core]);

  const isAddCommentDisabled = isOfficeEditorCommentPanel && activeStream !== EditingStreamType.BODY;

  return (
    <div className='comment-panel-footer'>
      <div className='divider' />
      <TextButton
        className='add-new-button'
        img='icon-menu-add'
        dataElement={isOfficeEditorCommentPanel
          ? DataElements.OFFICE_EDITOR_COMMENT_ADD_NEW_BUTTON
          : DataElements.SPREADSHEET_EDITOR_COMMENT_ADD_NEW_BUTTON}
        disabled={isAddCommentDisabled}
        label={`${t('action.add')} ${t('action.comment')}`}
        ariaLabel={`${t('action.add')} ${t('action.comment')}`}
        onClick={handleAddComment}
      />
    </div>
  );
};

CommentPanelFooter.propTypes = {
  dataElement: PropTypes.string,
  existingCommentAtSelectedCell: PropTypes.object,
};

export default CommentPanelFooter;
