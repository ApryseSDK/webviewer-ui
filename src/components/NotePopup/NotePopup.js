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
    const isFreeText = annotation instanceof window.Annotations.FreeTextAnnotation;

    if (isFreeText) {
      core.getAnnotationManager().trigger('annotationDoubleClicked', annotation);
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    core.deleteAnnotations([annotation]);
  };

  const handleStateUpdate = state => {
    const stateAnnot = createStateAnnot(annotation, state);

    annotation.addReply(stateAnnot);

    const annotManager = core.getAnnotationManager();
    annotManager.addAnnotation(stateAnnot);
    annotManager.trigger('addReply', [stateAnnot, annotation, annotManager.getRootAnnotation(annotation)]);
  };

  const createStateAnnot = (annotation, state) => {
    // TODO: the code below is copied from annotManager.updateAnnotationState in WebViewer to work around the issue
    // in https://github.com/PDFTron/webviewer-ui/issues/620
    // the implement before wasn't causing any actual issues, but it was confusing and unnecessary to trigger two annotationChanged events when a status is set
    // A proper fix should be done once https://trello.com/c/zWlkygNb/1023-consider-adding-a-setlocalizationhandler-to-corecontrols is implemented
    // at that time, we could use the translation handler(t) internally in updateAnnotationState before setting the contents, and use that function instead in this component

    const stateAnnot = new Annotations.StickyAnnotation();

    stateAnnot['InReplyTo'] = annotation['Id'];
    stateAnnot['X'] = annotation['X'];
    stateAnnot['Y'] = annotation['Y'];
    stateAnnot['PageNumber'] = annotation['PageNumber'];
    stateAnnot['Subject'] = 'Sticky Note';
    stateAnnot['Author'] = core.getCurrentUser();
    stateAnnot['State'] = state;
    stateAnnot['StateModel'] = 'Review';
    stateAnnot['Hidden'] = true;

    const displayAuthor = core.getDisplayAuthor(stateAnnot);
    const stateMessage = t(`option.state.${state.toLowerCase()}`);
    const contents = `${stateMessage} ${t('option.state.setBy')} ${displayAuthor}`;
    stateAnnot.setContents(contents);

    return stateAnnot;
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
