import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import PopupPortal from 'components/PopupPortal';
import AnnotationStylePopup from 'components/AnnotationStylePopup';

import useOnClickOutside from 'hooks/useOnClickOutside';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import { getOpenedWarningModal, getOpenedColorPicker, getDatePicker } from 'helpers/getElements';
import actions from 'actions';
import {
  AnnotationStylePopupTabs,
  updateAnnotationStylePopupTabs,
  copyMapWithDataProperties,
  getDataWithKey,
} from 'constants/map';


import './MultiStylePopup.scss';

const MultiStylePopup = ({
  annotations,
  triggerElementName,
  onClose = () => { },
}) => {
  const dispatch = useDispatch();
  const popupRef = useRef();
  const [styleTabs, setStyleTabs] = useState([]);
  const [position, setPosition] = useState({ left: 'auto', right: 'auto', top: 'auto' });
  const colorMapKey = 'MultiStyle';

  useOnClickOutside(popupRef, (e) => {
    const triggerElement = document.querySelector(`[data-element=${triggerElementName}]`);
    const clickedTrigger = triggerElement.contains(e.target);
    const warningModal = getOpenedWarningModal();
    const colorPicker = getOpenedColorPicker();
    const datePicker = getDatePicker();

    if (!clickedTrigger && !warningModal && !colorPicker && !datePicker) {
      // we only want to close the popup if we clicked outside and not on the trigger
      onClose();
    }
  });

  let style = {};
  annotations.forEach((annotation) => {
    style = { ...style, ...getAnnotationStyles(annotation) };
  });
  const freeTextAnnotation = annotations.find((annotation) => {
    return (
      annotation instanceof window.Annotations.FreeTextAnnotation &&
      (annotation.getIntent() === window.Annotations.FreeTextAnnotation.Intent.FreeText ||
      annotation.getIntent() === window.Annotations.FreeTextAnnotation.Intent.FreeTextCallout)
    );
  });
  let properties = {};
  if (freeTextAnnotation) {
    const richTextStyles = freeTextAnnotation.getRichTextStyle();
    properties = {
      Font: freeTextAnnotation.Font,
      FontSize: freeTextAnnotation.FontSize,
      TextAlign: freeTextAnnotation.TextAlign,
      TextVerticalAlign: freeTextAnnotation.TextVerticalAlign,
      bold: richTextStyles?.[0]?.['font-weight'] === 'bold' ?? false,
      italic: richTextStyles?.[0]?.['font-style'] === 'italic' ?? false,
      underline: richTextStyles?.[0]?.['text-decoration']?.includes('underline') || richTextStyles?.[0]?.['text-decoration']?.includes('word'),
      strikeout: richTextStyles?.[0]?.['text-decoration']?.includes('line-through') ?? false,
    };
  }

  // Update available palettesfor MultiStyle annotation type in map
  useEffect(() => {
    const availablePalettes = [];
    style['TextColor'] && availablePalettes.push(AnnotationStylePopupTabs.TEXT_COLOR);
    style['StrokeColor'] && availablePalettes.push(AnnotationStylePopupTabs.STROKE_COLOR);
    style['FillColor'] && availablePalettes.push(AnnotationStylePopupTabs.FILL_COLOR);

    const didUpdate =
      updateAnnotationStylePopupTabs(colorMapKey, availablePalettes, availablePalettes[0]);
    if (didUpdate) {
      const newColorMap = copyMapWithDataProperties('currentStyleTab', 'iconColor');
      dispatch(actions.setColorMap(newColorMap));
      const { styleTabs: _styleTabs } = getDataWithKey(colorMapKey);
      setStyleTabs(_styleTabs);
    }
  }, [annotations]);

  const updatePosition = () => {
    const position = getOverlayPositionBasedOn(triggerElementName, popupRef);
    setPosition(position);
  };

  // Have to wait until palettes are available before showing popup
  if (styleTabs.length === 0) {
    return null;
  }

  return (
    <PopupPortal
      id="multi-style-popup-portal"
      position={position}
    >
      <div
        className='multi-style-container'
        ref={popupRef}
      >
        <AnnotationStylePopup
          annotations={annotations}
          style={style}
          isOpen
          onResize={updatePosition}
          isFreeText={!!freeTextAnnotation}
          colorMapKey={colorMapKey}
          properties={properties}
          isRedaction={false}
          isMeasure={false}
          showLineStyleOptions={false}
          hideSnapModeCheckbox={false}
        />
      </div>
    </PopupPortal >
  );
};

export default MultiStylePopup;