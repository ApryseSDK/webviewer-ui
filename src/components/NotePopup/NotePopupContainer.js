import React from 'react';
import core from 'core';
import NotePopup from './NotePopup';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

function NotePopupContainer(props) {
  const [
    activeDocumentViewerKey,
  ] = useSelector((state) => [
    selectors.getActiveDocumentViewerKey(state),
  ]);
  const { annotation, setIsEditing, noteIndex } = props;

  const [canModify, setCanModify] = React.useState(core.canModify(annotation));
  const [canModifyContents, setCanModifyContents] = React.useState(core.canModifyContents(annotation));

  React.useEffect(() => {
    function onUpdateAnnotationPermission() {
      setCanModify(core.canModify(annotation, activeDocumentViewerKey));
      setCanModifyContents(core.canModifyContents(annotation, activeDocumentViewerKey));
    }

    onUpdateAnnotationPermission();
    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission, undefined, activeDocumentViewerKey);
    return () => core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission, activeDocumentViewerKey);
  }, [annotation, activeDocumentViewerKey]);

  const handleEdit = React.useCallback(() => {
    const isFreeText = annotation instanceof window.Core.Annotations.FreeTextAnnotation;
    if (isFreeText && core.getAnnotationManager(activeDocumentViewerKey).isFreeTextEditingEnabled()) {
      core.getAnnotationManager(activeDocumentViewerKey).trigger('annotationDoubleClicked', annotation);
    } else {
      setIsEditing(true, noteIndex);
    }
  }, [annotation, setIsEditing, noteIndex]);

  const handleDelete = React.useCallback(() => {
    core.deleteAnnotations([annotation, ...annotation.getGroupedChildren()], undefined, activeDocumentViewerKey);
  }, [annotation]);

  const isEditable = canModifyContents;
  const isDeletable = canModify && !annotation?.NoDelete;
  const noteId = (annotation) ? annotation.Id : '';

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
