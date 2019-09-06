import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Icon from 'components/Icon';

import core from 'core';
import actions from 'actions';
import selectors from 'selectors';

import './NotePopup.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
};

const NotePopup = ({ annotation, setIsEditing }) => {
  const [
    notePopupId,
    isDisabled,
    isEditDisabled,
    isDeleteDisabled,
  ] = useSelector(
    state => [
      selectors.getNotePopupId(state),
      selectors.isElementDisabled(state, 'notePopup'),
      selectors.isElementDisabled(state, 'notePopupEdit'),
      selectors.isElementDisabled(state, 'notePopupDelete'),
    ],
    shallowEqual,
  );
  const [canModify, setCanModify] = useState(core.canModify(annotation));
  const [canModifyContents, setCanModifyContents] = useState(core.canModifyContents(annotation));
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const isOpen = notePopupId === annotation.Id;

  useEffect(() => {
    const onUpdateAnnotationPermission = () => {
      setCanModify(core.canModify(annotation));
      setCanModifyContents(core.canModifyContents(annotation));
    };

    core.addEventListener(
      'updateAnnotationPermission',
      onUpdateAnnotationPermission,
    );
    return () =>
      core.removeEventListener(
        'updateAnnotationPermission',
        onUpdateAnnotationPermission,
      );
  }, [annotation]);

  const togglePopup = () => {
    if (isOpen) {
      closePopup();
    } else {
      dispatch(actions.setNotePopupId(annotation.Id));
    }
  };

  const closePopup = () => {
    dispatch(actions.setNotePopupId(''));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    core.deleteAnnotations([annotation]);
  };

  const isEditable = !isEditDisabled && canModifyContents;
  const isDeletable = !isDeleteDisabled && canModify;

  return !(isEditable || isDeletable) || isDisabled ? null : (
    <div
      className="NotePopup"
      data-element="notePopup"
      onMouseDown={e => e.stopPropagation()}
    >
      <div className="overflow" onClick={togglePopup}>
        <Icon glyph="ic_overflow_black_24px" />
      </div>
      {isOpen && (
        <div className="options" onClick={closePopup}>
          {isEditable && (
            <div data-element="notePopupEdit" onClick={handleEdit}>
              {t('action.edit')}
            </div>
          )}
          {isDeletable && (
            <div data-element="notePopupDelete" onClick={handleDelete}>
              {t('action.delete')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

NotePopup.propTypes = propTypes;

export default NotePopup;
