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
    isStateDisabled,
  ] = useSelector(
    state => [
      selectors.getNotePopupId(state),
      selectors.isElementDisabled(state, 'notePopup'),
      selectors.isElementDisabled(state, 'notePopupEdit'),
      selectors.isElementDisabled(state, 'notePopupDelete'),
      selectors.isElementDisabled(state, 'notePopupState'),
    ],
    shallowEqual,
  );
  const [canModify, setCanModify] = useState(core.canModify(annotation));
  const [canModifyContents, setCanModifyContents] = useState(
    core.canModifyContents(annotation),
  );
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

  const handleStateUpdate = state => {
    const author = core.getCurrentUser();
    const message = `${state} ${t('option.state.setBy')} ${author}`;
    const stateModel = 'Review';
    core.updateAnnotationState(annotation, state, stateModel, message);
  };

  const isReply = annotation.isReply();
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
          {!isStateDisabled && !isReply && (
            <div data-element="notePopupState">
              <p data-element="notePopupSetStatus">{t('option.state.set')}</p>
              <div
                data-element="notePopupStateAccepted"
                onClick={() => handleStateUpdate('Accepted')}
              >
                {t('option.state.accepted')}
              </div>
              <div
                data-element="notePopupStateRejected"
                onClick={() => handleStateUpdate('Rejected')}
              >
                {t('option.state.rejected')}
              </div>
              <div
                data-element="notePopupStateCancelled"
                onClick={() => handleStateUpdate('Cancelled')}
              >
                {t('option.state.cancelled')}
              </div>
              <div
                data-element="notePopupStateCompleted"
                onClick={() => handleStateUpdate('Completed')}
              >
                {t('option.state.completed')}
              </div>
              <div
                data-element="notePopupStateNone"
                onClick={() => handleStateUpdate('None')}
              >
                {t('option.state.none')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

NotePopup.propTypes = propTypes;

export default NotePopup;
