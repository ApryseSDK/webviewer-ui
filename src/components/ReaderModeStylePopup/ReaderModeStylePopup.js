import React, { useState, useEffect, useRef } from 'react';
import StylePopup from 'components/StylePopup';
import useOnClickOutside from 'hooks/useOnClickOutside';
import Draggable from 'react-draggable';
import { getReaderModePopupPositionBasedOn } from 'helpers/getPopupPosition';
import { getOpenedWarningModal, getOpenedColorPicker } from 'helpers/getElements';

import './ReaderModeStylePopup.scss';

const ReaderModeStylePopup = (props) => {
  const [position, setPosition] = useState({});
  const popupRef = useRef(null);

  useEffect(() => {
    setPosition(getReaderModePopupPositionBasedOn(props.annotPosition, popupRef, props.viewer));
  }, []);

  useOnClickOutside(popupRef, () => {
    const warningModal = getOpenedWarningModal();
    const colorPicker = getOpenedColorPicker();
    if (!warningModal && !colorPicker) {
      props.onClose();
    }
  });

  return (
    <Draggable cancel=".Button, .cell, .sliders-container svg, select">
      <div
        className="ReaderModeStylePopup"
        style={position}
        ref={popupRef}
      >
        <StylePopup
          {...props}
          disableSeparator
        />
      </div>
    </Draggable>
  );
};

export default ReaderModeStylePopup;
