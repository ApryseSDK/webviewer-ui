import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Tooltip from '../Tooltip';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';
import ShareTypes from 'constants/shareTypes';

import './NoteState.scss';
import { getAnnotationShareType, setAnnotationShareType } from 'src/helpers/annotationShareType';

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
    switch (getAnnotationShareType(annotation)) {
      case ShareTypes.ASSESSORS:
        return 'icon-page-insertion-insert-above';
      case ShareTypes.PARTICIPANTS:
        return 'icon-tool-stamp-fill';
      case ShareTypes.ALL:
        return 'ic_annotation_apply_redact_black_24px';
      case ShareTypes.NONE:
      default:
        return 'icon-annotation-status-none';
    }
  };
  function createOnStateOptionButtonClickHandler(state) {
    return function onStateOptionButtonClick() {
      if (handleStateChange) {
        handleStateChange(state);
        setAnnotationShareType(annotation, state);
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
  return (
    <DataElementWrapper className="NoteState" dataElement="noteState" onClick={togglePopup} ref={popupRef}>
      <Tooltip content={t('option.notesOrder.shareType')}>
        <div className={noteStateButtonClassName}>
          <Icon glyph={getStatusIcon()} />
        </div>
      </Tooltip>
      {isOpen && (
        <button className="note-state-options" onClick={onStateOptionsButtonClick}>
          <DataElementWrapper dataElement="notePopupState">
            <DataElementWrapper
              dataElement="notePopupState-assessor"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler(ShareTypes.ASSESSORS)}
            >
              <Icon glyph="icon-page-insertion-insert-above" />
              {t('option.state.assessors')}
            </DataElementWrapper>

            <DataElementWrapper
              dataElement="notePopupStateParticipants"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler(ShareTypes.PARTICIPANTS)}
            >
              <Icon glyph="icon-tool-stamp-fill" />
              {t('option.state.participants')}
            </DataElementWrapper>

            <DataElementWrapper
              dataElement="notePopupStateAll"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler(ShareTypes.ALL)}
            >
              <Icon glyph="ic_annotation_apply_redact_black_24px" />
              {t('option.state.all')}
            </DataElementWrapper>

            <DataElementWrapper
              dataElement="notePopupStateAssessors"
              className="note-state-option"
              onClick={createOnStateOptionButtonClickHandler(ShareTypes.NONE)}
            >
              <Icon glyph="icon-colour-none" />
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
