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
import getCommentCellLocation from 'src/helpers/spreadsheetEditor/getCommentCellLocation';

const CommentPanelFooter = ({ dataElement, existingCommentAtSelectedCell }) => {
  const [t] = useTranslation();
  const { core } = useCore();
  const dispatch = useDispatch();
  const activeStream = useSelector(selectors.getOfficeEditorActiveStream);
  const activeCellRange = useSelector(selectors.getActiveCellRange);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const isOfficeEditorCommentPanel = dataElement === DataElements.OFFICE_EDITOR_COMMENT_PANEL;
  const isSpreadsheetEditorCommentPanel = dataElement === DataElements.SPREADSHEET_EDITOR_COMMENT_PANEL;

  const handleAddReplyToExistingComment = useCallback((existingComment) => {
    if (!existingComment) {
      console.warn('Failed to add a reply. No existing comment found.');
      return;
    }

    // Just select the thread and focus its reply input; the actual reply annotation
    // is only created once the user submits text, so repeated clicks can't spam replies.
    core.deselectAllAnnotations();
    core.selectAnnotation(existingComment, activeDocumentViewerKey);
    dispatch(actions.triggerNoteEditing());
  }, [dispatch, core, activeDocumentViewerKey]);

  const handleAddSpreadsheetComment = useCallback(() => {
    if (existingCommentAtSelectedCell) {
      handleAddReplyToExistingComment(existingCommentAtSelectedCell);
      return;
    }

    const spreadsheetEditorManager = core.getDocumentViewer()?.getSpreadsheetEditorManager();
    const commentCellLocation = getCommentCellLocation(spreadsheetEditorManager, activeCellRange);
    if (!commentCellLocation) {
      console.warn('Could not get comment cell location. No action performed.');
      return;
    }

    try {
      const commentManager = spreadsheetEditorManager?.getCommentManager?.();
      const comment = commentManager.addComment('', commentCellLocation);

      const annotation = core.getAnnotationById(comment.getId());
      if (!annotation) {
        return;
      }
      core.deselectAllAnnotations();
      core.selectAnnotation(annotation, activeDocumentViewerKey);
      dispatch(actions.triggerNoteEditing());
    } catch (error) {
      console.warn('Failed to add comment:', error);
    }
  }, [existingCommentAtSelectedCell, handleAddReplyToExistingComment, activeCellRange, dispatch, core, activeDocumentViewerKey]);

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
