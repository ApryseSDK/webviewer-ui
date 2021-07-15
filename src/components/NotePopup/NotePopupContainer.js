import React from 'react';
import core from 'core';
import NotePopup from './NotePopup';

function NotePopupContainer(props) {
  const { annotation, setIsEditing, noteIndex, notePopupId } = props; // eslint-disable-line react/prop-types

  const [canModify, setCanModify] = React.useState(core.canModify(annotation));
  const [canModifyContents, setCanModifyContents] = React.useState(core.canModifyContents(annotation));

  React.useEffect(() => {
    function onUpdateAnnotationPermission() {
      setCanModify(core.canModify(annotation));
      setCanModifyContents(core.canModifyContents(annotation));
    }
    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    return () =>
      core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
  }, [annotation]);

  const handleEdit = React.useCallback(function handleEdit(){
    const isFreeText = annotation instanceof window.Annotations.FreeTextAnnotation;
    if (isFreeText && core.getAnnotationManager().isFreeTextEditingEnabled()) {
      core.getAnnotationManager().trigger('annotationDoubleClicked', annotation);
    } else {
      setIsEditing(true, noteIndex);
    }
  }, [annotation, setIsEditing, noteIndex]);

  const handleDelete = React.useCallback(function handleDelete() {
    core.deleteAnnotations([annotation, ...annotation.getGroupedChildren()]);
  },[annotation]);

  const isEditable = canModifyContents;
  const isDeletable = canModify && !annotation?.NoDelete;
  const isOpen = notePopupId === annotation?.Id;

  const passProps = {
    handleEdit,
    handleDelete,
    isEditable,
    isDeletable,
    isOpen
  };

  return (
    <NotePopup {...props} {...passProps} />
  );
}

export default NotePopupContainer;

