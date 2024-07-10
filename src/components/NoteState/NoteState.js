import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import selectors from 'selectors';
import Tooltip from '../Tooltip';
import NoteStatePopup from './NoteStatePopup';

import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';

import './NoteState.scss';
import { useSelector } from 'react-redux';

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

  const customizableUI = useSelector((state) => selectors.getFeatureFlags(state)?.customizableUI);
  const annotationState = annotation.getStatus();
  const icon = `icon-annotation-status-${annotationState === '' ? 'none' : annotationState.toLowerCase()}`;
  const noteStateButtonClassName = classNames('overflow', { active: isOpen });
  const dataElement = 'noteState';
  const id = annotation.Id;

  return (
    <DataElementWrapper
      className={classNames({
        'NoteState': true,
        'modular-ui': customizableUI,
      })}
      dataElement={dataElement}
      onClick={togglePopup}
      ref={popupRef}
      data-id={id}
    >
      <Tooltip content={t('option.notesOrder.status')}>
        <div className={noteStateButtonClassName}>
          <Icon glyph={icon} />
        </div>
      </Tooltip>
      {isOpen && (
        <NoteStatePopup
          triggerElementName={id}
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
