import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Tooltip from '../Tooltip';

import core from 'core';

import DataElementWrapper from 'components/DataElementWrapper';
import ShareTypes from 'constants/shareTypes';
import ShareTypeIcon from './ShareTypeIcon';

import './NoteState.scss';

import { getAnnotationShareType } from 'src/helpers/annotationShareType';

const propTypes = {
  annotation: PropTypes.object,
  isSelected: PropTypes.bool,
  openOnInitialLoad: PropTypes.bool,
  handleStateChange: PropTypes.func,
  share: PropTypes.object,
  noteIndex: PropTypes.number,
};

function NoteState(props) {
  const {
    annotation,
    isSelected = false,
    openOnInitialLoad = false,
    handleStateChange,
    share,
    noteIndex,
    annotationId,
  } = props;

  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(openOnInitialLoad);
  const popupRef = useRef();

  const isOwnedByCurrentUser = annotation.Author === core.getCurrentUser();

  useOnClickOutside(popupRef, () => {
    setIsOpen(false);
  });

  const togglePopup = e => {
    e.stopPropagation();
    if (!isOwnedByCurrentUser) return;
    setIsOpen(!isOpen);
  };

  function onStateOptionsButtonClick() {
    setIsOpen(false);
  }

  const getShareTypeIcon = (shareType, ariaLabel) => {
    return <ShareTypeIcon shareType={shareType} ariaLabel={ariaLabel} />;
  };

  function createOnStateOptionButtonClickHandler(state) {
    // If not current author, do not allow state change
    if (!isOwnedByCurrentUser) return;

    return function onStateOptionButtonClick() {
      if (handleStateChange) {
        handleStateChange(state);
      }
    };
  }

  if (!annotation) {
    return null;
  }

  const annotationShareType = getAnnotationShareType(annotation) || ShareTypes.NONE;
  const isReply = annotation.isReply();
  const annotationTooltip = `${t('option.notesOrder.shareType')}: ${t(
    `option.state.${annotationShareType.toLowerCase()}`,
  )}`;
  const icon = getShareTypeIcon(annotationShareType, annotationTooltip);

  // Hide sharetype menu if annotation is not selected
  if (!isSelected) {
    return null;
  }

  if (isReply) {
    return null;
  }

  const noteStateButtonClassName = classNames('overflow', { active: isOpen });
  return (
    <DataElementWrapper className="NoteState" dataElement="noteState" onClick={togglePopup} ref={popupRef}>
      <Tooltip
        translatedContent={annotationTooltip}
      >
        <div className={noteStateButtonClassName}>{icon}</div>
      </Tooltip>
      {isOpen && (
        <button
          className={`note-state-options ${isOwnedByCurrentUser ? 'enabled' : 'disabled'}`}
          onClick={onStateOptionsButtonClick}
        >
          <DataElementWrapper dataElement="notePopupState">
            <DataElementWrapper
              dataElement="notePopupState-assessor"
              className={`note-state-option${annotationShareType === ShareTypes.ASSESSORS ? ' selected' : ''}`}
              onClick={createOnStateOptionButtonClickHandler(ShareTypes.ASSESSORS)}
            >
              {getShareTypeIcon(ShareTypes.ASSESSORS)}
              {t('option.state.assessors')}
            </DataElementWrapper>

            <DataElementWrapper
              dataElement="notePopupStateParticipants"
              className={`note-state-option${annotationShareType === ShareTypes.PARTICIPANTS ? ' selected' : ''}`}
              onClick={createOnStateOptionButtonClickHandler(ShareTypes.PARTICIPANTS)}
            >
              {getShareTypeIcon(ShareTypes.PARTICIPANTS)}
              {t('option.state.participants')}
            </DataElementWrapper>

            <DataElementWrapper
              dataElement="notePopupStateAll"
              className={`note-state-option${annotationShareType === ShareTypes.ALL ? ' selected' : ''}`}
              onClick={createOnStateOptionButtonClickHandler(ShareTypes.ALL)}
            >
              {getShareTypeIcon(ShareTypes.ALL)}
              {t('option.state.all')}
            </DataElementWrapper>

            <DataElementWrapper
              dataElement="notePopupStateAssessors"
              className={`note-state-option${annotationShareType === ShareTypes.NONE ? ' selected' : ''}`}
              onClick={createOnStateOptionButtonClickHandler(ShareTypes.NONE)}
            >
              {getShareTypeIcon(ShareTypes.NONE)}
              {t('option.state.none')}
            </DataElementWrapper>
          </DataElementWrapper>
        </button>
      )}
    </DataElementWrapper>
  );
}

NoteState.propTypes = propTypes;

export default NoteState;
