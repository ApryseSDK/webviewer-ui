import React, { useCallback, useContext, useEffect, useState } from 'react';
import useCore from 'hooks/useCore';
import NotePopup from './NotePopup';
import { deleteOfficeEditorComment } from 'helpers/officeEditorCommentHelper';
import { deleteSpreadsheetEditorComment } from 'helpers/spreadsheetEditorCommentHelper';
import NoteContext from 'components/Note/Context';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import { SpreadsheetCommentState, SpreadsheetEditorEditMode, SPREADSHEET_COMMENT_STATE_KEY } from 'constants/spreadsheetEditor';

function NotePopupContainer(props) {
  const { annotation, setIsEditing, editingKey, flyoutId } = props;
  const { core } = useCore();
  const { isOfficeEditorCommentAnnotation, isSpreadsheetEditorCommentAnnotation } = useContext(NoteContext);
  const dispatch = useDispatch();
  const isReadOnly = core.getIsReadOnly();
  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const rootAnnotation = isSpreadsheetEditorCommentAnnotation && annotation?.isReply?.()
    ? core.getAnnotationManager().getAnnotationById(annotation.InReplyTo)
    : annotation;
  const rootCommentState = rootAnnotation?.getCustomData(SPREADSHEET_COMMENT_STATE_KEY);
  const isSSECommentEditable = (!annotation?.isReply?.() || rootCommentState === (SpreadsheetCommentState?.OPEN ));
  const canModifyAnnotation = () => {
    const isOfficeEditorModifyEnabled = isOfficeEditorCommentAnnotation && !isReadOnly;
    const isSpreadsheetEditorModifyEnabled = isSpreadsheetEditorCommentAnnotation
      && !isReadOnly
      && spreadsheetEditorEditMode !== SpreadsheetEditorEditMode.VIEW_ONLY;
    const isNonPDFAnnotation = isOfficeEditorCommentAnnotation || isSpreadsheetEditorCommentAnnotation;
    return isOfficeEditorModifyEnabled || isSpreadsheetEditorModifyEnabled || (!isNonPDFAnnotation && core.canModify(annotation));
  };
  const canModifyAnnotationContents = () => {
    if (isSpreadsheetEditorCommentAnnotation) {
      return isSSECommentEditable;
    }
    return core.canModifyContents(annotation);
  };
  const [canModify, setCanModify] = useState(canModifyAnnotation);
  const [canModifyContents, setCanModifyContents] = useState(canModifyAnnotationContents);

  useEffect(() => {
    function onUpdateAnnotationPermission() {
      setCanModify(canModifyAnnotation());
      setCanModifyContents(canModifyAnnotationContents());
    }

    onUpdateAnnotationPermission();
    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    return () => core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
  }, [annotation, isOfficeEditorCommentAnnotation, isSpreadsheetEditorCommentAnnotation, isReadOnly, spreadsheetEditorEditMode, rootCommentState, core]);

  const handleEdit = useCallback(() => {
    const isFreeText = annotation instanceof window.Core.Annotations.FreeTextAnnotation;
    if (isFreeText && core.getAnnotationManager().isFreeTextEditingEnabled()) {
      core.getAnnotationManager().trigger('annotationDoubleClicked', annotation);
    } else {
      if (isOfficeEditorCommentAnnotation || isSpreadsheetEditorCommentAnnotation) {
        dispatch(actions.triggerNoteEditing());
      }
      setIsEditing(true, editingKey);
    }
  }, [annotation, setIsEditing, editingKey, core]);

  const handleDelete = useCallback(() => {
    if (isOfficeEditorCommentAnnotation) {
      return deleteOfficeEditorComment({ annotation, core });
    }
    if (isSpreadsheetEditorCommentAnnotation) {
      return deleteSpreadsheetEditorComment({ annotation, core });
    }
    core.deleteAnnotations([annotation, ...annotation.getGroupedChildren()]);
  }, [annotation, core, isOfficeEditorCommentAnnotation, isSpreadsheetEditorCommentAnnotation]);

  const isEditable = canModifyContents;
  const isDeletable = canModify && !annotation?.NoDelete;
  const noteId = flyoutId || ((annotation) ? annotation.Id : '');
  const passProps = {
    handleEdit,
    handleDelete,
    isEditable,
    isDeletable,
    noteId,
  };

  return (
    <NotePopup {...props} {...passProps} />
  );
}

export default NotePopupContainer;
