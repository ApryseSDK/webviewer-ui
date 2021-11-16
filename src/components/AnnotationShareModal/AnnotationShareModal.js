import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';

import core from 'core';
import actions from 'actions';
import useOnClickOutside from 'hooks/useOnClickOutside';
import selectors from 'selectors';

import './AnnotationShareModal.scss';

const AnnotationShareModal = ({
  annotation,
}) => {
  const [isOpen, isDisabled] = useSelector(
    state => [
      selectors.isElementOpen(state, 'annotationShareModal'),
      selectors.isElementDisabled(state, 'annotationShareModal')
    ],
    shallowEqual
  );
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const popupRef = useRef();

  useEffect(() => {
    isOpen && popupRef.current;
  }, [isOpen]);

  useOnClickOutside(popupRef, e => {
    const notesPanel = document.querySelector('[data-element="notesPanel"]');
    const clickedInNotesPanel = notesPanel?.contains(e.target);

    const warningModal = getOpenedWarningModal();
    const colorPicker = getOpenedColorPicker();

    // the notes panel has mousedown handlers to handle the opening/closing states of this component
    // we don't want this handler to run when clicked in the notes panel otherwise the opening/closing states may mess up
    // for example: click on a note will call core.selectAnnotation which triggers the annotationSelected event
    // and opens this component. If we don't exclude the notes panel this handler will run and close it after
    if (!clickedInNotesPanel && !warningModal && !colorPicker) {
      dispatch(actions.closeElement('annotationShareModal'));
    }
  });

  useEffect(() => {
    const closeAndReset = () => {
      dispatch(actions.closeElement('annotationShareModal'));
    };

    core.addEventListener('documentUnloaded', closeAndReset);
    window.addEventListener('resize', closeAndReset);
    return () => {
      core.removeEventListener('documentUnloaded', closeAndReset);
      window.removeEventListener('resize', closeAndReset);
    };
  });

  const handleApply = () => {
    const annotManager = core.getAnnotationManager();
    core.setAnnotationCustomData(annotation, 'customKeyIsPublic', true);
    annotManager.deselectAllAnnotations();
    annotManager.trigger('annotationChanged', [[annotation], 'modify', []]);

    closeModal();
  };

  const closeModal = () => {
    dispatch(actions.closeElements(['annotationShareModal']));
  };

  return !annotation ? null : (
    <div
      className={classNames({
        Modal: true,
        AnnotationShareModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element="annotationShareModal"
      onMouseDown={closeModal}
    >
      <div className="container" onMouseDown={e => e.stopPropagation()}>
        <div className="swipe-indicator" />
        <div className="annotation_share__header">
        {t('action.are_you_sure')}
        </div>
        <div className="annotation_share__body">
        {t('action.confirm_share_annotation')}
        </div>
        <div className="annotation_share__footer">
        <Button
            dataElement="shareCancel"
            label={t('action.cancel')}
            onClick={closeModal}
          />
          <Button
            dataElement="shareSubmit"
            label={t('action.yes')}
            onClick={handleApply}
          />
        </div>
      </div>
    </div>
  );
};

export default AnnotationShareModal;
