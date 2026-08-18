import React, { useCallback, useContext, useEffect, useState } from 'react';
import useCore from 'hooks/useCore';
import NotePopup from './NotePopup';
import { deleteOfficeEditorComment } from 'helpers/officeEditorCommentHelper';
import { deleteSpreadsheetEditorComment } from 'helpers/spreadsheetEditorCommentHelper';
import NoteContext from 'components/Note/Context';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';

function NotePopupContainer(props) {
  const { annotation, setIsEditing, editingKey, flyoutId } = props;
  const { core } = useCore();
  const { isOfficeEditorCommentAnnotation, isSpreadsheetEditorCommentAnnotation } = useContext(NoteContext);
  const dispatch = useDispatch();
  const isReadOnly = core.getIsReadOnly();
  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const isSSEReadOnly = isReadOnly || spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;
  const canModifyAnnotation = () => {
    const isOfficeEditorModifyEnabled = isOfficeEditorCommentAnnotation && !isReadOnly;
    const isSpreadsheetEditorModifyEnabled = isSpreadsheetEditorCommentAnnotation && !isSSEReadOnly;
    const isNonPDFAnnotation = isOfficeEditorCommentAnnotation || isSpreadsheetEditorCommentAnnotation;
    return isOfficeEditorModifyEnabled || isSpreadsheetEditorModifyEnabled || (!isNonPDFAnnotation && core.canModify(annotation));
  };
  const [canModify, setCanModify] = useState(canModifyAnnotation);
  const [canModifyContents, setCanModifyContents] = useState(core.canModifyContents(annotation));

  useEffect(() => {
    function onUpdateAnnotationPermission() {
      setCanModify(canModifyAnnotation());
      setCanModifyContents(core.canModifyContents(annotation));
    }

    onUpdateAnnotationPermission();
    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    return () => core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
  }, [annotation, isOfficeEditorCommentAnnotation, isSpreadsheetEditorCommentAnnotation, isReadOnly, spreadsheetEditorEditMode, core]);

  const handleEdit = useCallback(() => {
    const isFreeText = annotation instanceof window.Core.Annotations.FreeTextAnnotation;
    if (isFreeText && core.getAnnotationManager().isFreeTextEditingEnabled()) {
      core.getAnnotationManager().trigger('annotationDoubleClicked', annotation);
    } else {
      if (isOfficeEditorCommentAnnotation) {
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
