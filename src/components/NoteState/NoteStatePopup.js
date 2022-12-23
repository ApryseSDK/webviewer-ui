
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useOnClickOutside from 'hooks/useOnClickOutside';
import DataElementWrapper from 'components/DataElementWrapper';
import PopupPortal from 'components/PopupPortal';
import Icon from 'components/Icon';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import PropTypes from 'prop-types';

import './NoteState.scss';

const propTypes = {
  style: PropTypes.object.isRequired,
  triggerElementName: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  handleStateChange: PropTypes.func,
};

const NoteStatePopup = ({
  style,
  triggerElementName,
  onClose = () => {},
  handleStateChange = () => {},
}) => {
  const [t] = useTranslation();
  const [position, setPosition] = useState({ left: 'auto', right: 'auto', top: 'auto' });
  const popupRef = useRef();

  useOnClickOutside(popupRef, (e) => {
    const triggerElement = document.querySelector(`[data-element=${triggerElementName}]`);
    const clickedTrigger = triggerElement.contains(e.target);
    if (!clickedTrigger) {
      // we only want to close the popup if we clicked outside and not on the trigger
      onClose();
    }
  });

  const createOnStateOptionButtonClickHandler = (state) => {
    return () => {
      handleStateChange(state);
    };
  };

  useEffect(() => {
    const position = getOverlayPositionBasedOn(triggerElementName, popupRef);
    setPosition(position);
  }, []);

  return (
    <div
      id="note-state-popup-portal"
      position={position}
    >
      <div
        style={style}
        className="note-state-options"
        ref={popupRef}
      >
        <DataElementWrapper dataElement="notePopupState">
          <DataElementWrapper
            dataElement="notePopupStateCompleted"
            className="note-state-option"
            onClick={createOnStateOptionButtonClickHandler('Completed')}
          >
            <Icon glyph="icon-annotation-status-completed" />
            {t('option.state.completed')}
          </DataElementWrapper>
        </DataElementWrapper>
      </div>
    </div>
  );
};

NoteStatePopup.propTypes = propTypes;

export default NoteStatePopup;