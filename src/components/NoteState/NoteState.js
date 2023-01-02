import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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
    handleStateChange = () => {},
  } = props;

  const [t] = useTranslation();

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
           <Icon class glyph={icon} />
         </DataElementWrapper>
       </DataElementWrapper>
  );
}

NoteState.propTypes = propTypes;

export default NoteState;
