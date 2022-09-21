import React from 'react';
import core from 'core';
import NotePopup from './NotePopup';
import Tooltip from 'components/Tooltip';
import { useTranslation } from 'react-i18next';

function NotePopupContainer(props) {
  const { annotation, setIsEditing, noteIndex } = props;

  const [canModify, setCanModify] = React.useState(core.canModify(annotation));
  const [canModifyContents, setCanModifyContents] = React.useState(core.canModifyContents(annotation));
  const [isOpen, setIsOpen] = React.useState(false);
  const [t] = useTranslation();

  React.useEffect(() => {
    function onUpdateAnnotationPermission() {
      setCanModify(core.canModify(annotation));
      setCanModifyContents(core.canModifyContents(annotation));
    }
    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    return () => core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
  }, [annotation]);

  const handleEdit = React.useCallback(() => {
    const isFreeText = annotation instanceof window.Annotations.FreeTextAnnotation;
    if (isFreeText && core.getAnnotationManager().isFreeTextEditingEnabled()) {
      core.getAnnotationManager().trigger('annotationDoubleClicked', annotation);
    } else {
      setIsEditing(true, noteIndex);
    }
  }, [annotation, setIsEditing, noteIndex]);

  const handleDelete = React.useCallback(() => {
    core.deleteAnnotations([annotation, ...annotation.getGroupedChildren()]);
  }, [annotation]);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  const isEditable = canModifyContents;
  const isDeletable = canModify && !annotation?.NoDelete;

  const passProps = {
    handleEdit,
    handleDelete,
    isEditable,
    isDeletable,
    isOpen,
    closePopup,
    openPopup,
  };

  // We wrap the element in a div so the tooltip works properly
  return (
    <Tooltip content={t('formField.formFieldPopup.options')}>
      <div>
        <NotePopup {...props} {...passProps} />
      </div>
    </Tooltip>
  );
}

export default NotePopupContainer;
