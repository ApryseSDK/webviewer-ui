import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Tooltip from '../Tooltip';
import NoteStatePopup from './NoteStatePopup';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';

import './NoteState.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
  openOnInitialLoad: PropTypes.bool,
  handleStateChange: PropTypes.func
};

function NoteState(props) {
  const {
    annotation,
    openOnInitialLoad = false,
    handleStateChange = () => {},
  } = props;

  const [t] = useTranslation();
  const [isOpen, setIsOpen] = useState(openOnInitialLoad);
  const popupRef = useRef();

  const togglePopup = (e) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const annotationState = annotation.getStatus();
  const icon = `icon-annotation-status-${annotationState === '' ? 'none' : annotationState.toLowerCase()}`;
  const noteStateButtonClassName = classNames('overflow', { active: isOpen });

  return (
    <DataElementWrapper
      className="NoteState"
      dataElement="noteState"
      onClick={togglePopup}
      ref={popupRef}
    >
      <Tooltip content={t('option.notesOrder.status')}>
        <div className={noteStateButtonClassName}>
          <Icon glyph={icon} />
        </div>
      </Tooltip>
      {isOpen && (
        <NoteStatePopup
          triggerElementName="noteState"
          handleStateChange={handleStateChange}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}
    </DataElementWrapper>
  );
}

NoteState.propTypes = propTypes;

export default NoteState;
