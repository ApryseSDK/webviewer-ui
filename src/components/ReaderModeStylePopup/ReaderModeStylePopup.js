import React, { useState, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import StylePopup from 'components/StylePopup';
import useOnClickOutside from 'hooks/useOnClickOutside';
import Draggable from 'react-draggable';
import { getReaderModePopupPositionBasedOn } from 'helpers/getPopupPosition';
import { getOpenedWarningModal, getOpenedColorPicker } from 'helpers/getElements';

import './ReaderModeStylePopup.scss';

const ReaderModeStylePopup = (props) => {
  const [position, setPosition] = useState({});
  const popupRef = useRef(null);

  useLayoutEffect(() => {
    setPosition(getReaderModePopupPositionBasedOn(props.annotPosition, popupRef, props.viewer));
  }, [props.annotPosition, props.viewer]);

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
        css={position}
        ref={popupRef}
      >
        <StylePopup
          {...props}
          annotationStyle={props.annotationStyle ?? props.style}
          disableSeparator
        />
      </div>
    </Draggable>
  );
};

ReaderModeStylePopup.propTypes = {
  annotationStyle: PropTypes.object,
  /**
   * @deprecated Use annotationStyle instead.
   * @ignore
   */
  style: PropTypes.object,
  annotPosition: PropTypes.object,
  viewer: PropTypes.object,
  onClose: PropTypes.func,
};

export default ReaderModeStylePopup;
