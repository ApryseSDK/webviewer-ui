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
  const icon = `icon-annotation-status-${annotationState === 'Completed' ? 'resolved' : 'opened'}`;

  const createOnStateOptionButtonClickHandler = (state) => {
    return () => {
      handleStateChange(state);
    };
  };

  return (
    <DataElementWrapper dataElement="notePopupState">
         <DataElementWrapper
           dataElement="notePopupStateCompleted"
           className="note-state-option"
           onClick={createOnStateOptionButtonClickHandler('Completed')}
         >
           <Icon glyph={icon} />
         </DataElementWrapper>
       </DataElementWrapper>
  );
}

NoteState.propTypes = propTypes;

export default NoteState;
