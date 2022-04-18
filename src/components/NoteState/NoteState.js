import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Tooltip from '../Tooltip';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';

import './NoteState.scss';

const propTypes = {
  annotation: PropTypes.object,
  isSelected: PropTypes.bool,
  openOnInitialLoad: PropTypes.bool,
  handleStateChange: PropTypes.func,
  share: PropTypes.object,
  noteIndex: PropTypes.number,
  annotationId: PropTypes.number,
  notesShareTypesMap: PropTypes.object,
  setNotesShareType: PropTypes.func,
};

function NoteState(props) {
  const {
    annotation,
    isSelected = false,
    openOnInitialLoad = false,
    handleStateChange,
    share,
    noteIndex,
    notesShareTypesMap,
    annotationId,
    setNotesShareType,
  } = props;

  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(openOnInitialLoad);
  const popupRef = useRef();

  useOnClickOutside(popupRef, () => {
    setIsOpen(false);
  });

  const togglePopup = e => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  function onStateOptionsButtonClick() {
    setIsOpen(false);
  }
  const getStatusIcon = () => {
    switch (notesShareTypesMap[annotationId]) {
      case 'Assessors':
        return 'icon-page-insertion-insert-above';
        break;
      case 'Participants':
        return 'icon-tool-stamp-fill';
        break;
      case 'All':
        return 'ic_annotation_apply_redact_black_24px';
        break;
      case 'None':
      default:
        return 'icon-annotation-status-none';
        break;
    }
  };
  function createOnStateOptionButtonClickHandler(state) {
    return function onStateOptionButtonClick() {
      if (handleStateChange) {
        handleStateChange(state);
        setNotesShareType(state, annotationId);
      }
    };
  }

  if (!annotation) {
    return null;
  }

  const annotationState = annotation.getStatus();
  const icon = `icon-annotation-status-${annotationState === '' ? 'none' : annotationState.toLowerCase()}`;
  const isReply = annotation.isReply();

  if ((annotationState === '' || annotationState === 'None') && !isSelected) {
    return null;
  }

  if (isReply) {
    return null;
  }

  const noteStateButtonClassName = classNames('overflow', { active: isOpen });
  console.log(share);
  console.log(`%c${annotationId}`, 'color:orange;font-family:system-ui;font-size:2rem;font-weight:bold');
  return (
    <DataElementWrapper className="NoteState" dataElement="noteState" onClick={togglePopup} ref={popupRef}>
      <Tooltip content={t('option.notesOrder.status')}>
        <div className={noteStateButtonClassName}>
          <Icon glyph={getStatusIcon()} />
        </div>
      </Tooltip>
      {isOpen && (
        <button className="note-state-options" onClick={onStateOptionsButtonClick}>
          <DataElementWrapper dataElement="notePopupState">
            <DataElementWrapper
              dataElement="notePopupStateNone"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler('None')}
            >
              <Icon glyph="icon-colour-none" />
              {t('option.state.none')}
            </DataElementWrapper>
            <DataElementWrapper
              dataElement="notePopupStateAssessors"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler('Assessors')}
            >
              <Icon glyph="icon-page-insertion-insert-above" />
              {t('option.state.assessors')}
            </DataElementWrapper>
            <DataElementWrapper
              dataElement="notePopupStateParticipants"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler('Participants')}
            >
              <Icon glyph="icon-tool-stamp-fill" />
              {t('option.state.participants')}
            </DataElementWrapper>
            <DataElementWrapper
              dataElement="notePopupStateAll"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler('All')}
            >
              <Icon glyph="ic_annotation_apply_redact_black_24px" />
              {t('option.state.all')}
            </DataElementWrapper>
          </DataElementWrapper>
        </button>
      )}
    </DataElementWrapper>
  );
}

NoteState.propTypes = propTypes;

export default NoteState;
