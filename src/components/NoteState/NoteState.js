import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';

import Icon from 'components/Icon';

import core from 'core';
import selectors from 'selectors';

import './NoteState.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
};

const NoteState = ({ annotation }) => {
  const [
    isDisabled,
    isEditDisabled,
    isStateDisabled,
  ] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'notePopup'),
      selectors.isElementDisabled(state, 'notePopupEdit'),
      selectors.isElementDisabled(state, 'notePopupDelete'),
      selectors.isElementDisabled(state, 'notePopupState'),
    ],
    shallowEqual,
  );
  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef();

  useOnClickOutside(popupRef, () => {
    closePopup();
  });

  const togglePopup = e => {
    e.stopPropagation();
    if (isOpen) {
      closePopup();
    } else {
      setIsOpen(true);
    }
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleStateUpdate = state => {
    const stateModel = 'Review';
    const stateAnnot = core.updateAnnotationState(annotation, state, stateModel);
    const author = core.getDisplayAuthor(stateAnnot);
    const stateMessage = t(`option.state.${state.toLowerCase()}`);
    const message = `${stateMessage} ${t('option.state.setBy')} ${author}`;
    core.setNoteContents(stateAnnot, message);
  };

  const annotationState = annotation.getStatus();
  const icon = `icon-annotation-status-${annotationState === '' ? 'none' : annotationState.toLowerCase()}`;
  const isReply = annotation.isReply();

  return isEditDisabled || isDisabled ? null : (
    <div
      className="NoteState"
      data-element="noteState"
      onClick={togglePopup}
    >
      <div className="overflow">
        <Icon glyph={icon} />
      </div>
      {isOpen && (
        <div ref={popupRef} className="options" onClick={closePopup}>
          {!isStateDisabled && !isReply && (
            <div data-element="notePopupState">
              <div
                data-element="notePopupStateAccepted"
                className="option"
                onClick={() => handleStateUpdate('Accepted')}
              >
                <Icon glyph="icon-annotation-status-accepted" />
                {t('option.state.accepted')}
              </div>
              <div
                data-element="notePopupStateRejected"
                className="option"
                onClick={() => handleStateUpdate('Rejected')}
              >
                <Icon glyph="icon-annotation-status-rejected" />
                {t('option.state.rejected')}
              </div>
              <div
                data-element="notePopupStateCancelled"
                className="option"
                onClick={() => handleStateUpdate('Cancelled')}
              >
                <Icon glyph="icon-annotation-status-cancelled" />
                {t('option.state.cancelled')}
              </div>
              <div
                data-element="notePopupStateCompleted"
                className="option"
                onClick={() => handleStateUpdate('Completed')}
              >
                <Icon glyph="icon-annotation-status-completed" />
                {t('option.state.completed')}
              </div>
              <div
                data-element="notePopupStateNone"
                className="option"
                onClick={() => handleStateUpdate('None')}
              >
                <Icon glyph="icon-annotation-status-none" />
                {t('option.state.none')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

NoteState.propTypes = propTypes;

export default NoteState;
