import React, { useState, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import selectors from 'selectors';
import DataElementWrapper from 'components/DataElementWrapper';
import ColorPalette from 'components/ColorPalette';
import actions from 'actions';
import useOnClickOutside from 'hooks/useOnClickOutside';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';

import DataElement from 'constants/dataElement';
import classNames from 'classnames';
import getRootNode from 'helpers/getRootNode';

import './ColorPickerOverlay.scss';

const ColorPickerOverlay = ({
  color,
  onStyleChange,
  portalElementId = 'app',
}) => {
  const [position, setPosition] = useState(() => ({ left: '555px', right: 'auto', top: 'auto' }));
  const overlayRef = useRef(null);
  const [
    isOpen,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, 'colorPickerOverlay'),
  ]);

  const dispatch = useDispatch();

  const onClickOutside = (e) => {
    const headerButton = getRootNode().querySelector(`[data-element="${DataElement.OFFICE_EDITOR_TEXT_COLOR_BUTTON}"]`);
    const flyoutButton = getRootNode().querySelector(`[data-element="${DataElement.OFFICE_EDITOR_COLOR_PICKER}"]`);
    const clickedButton = headerButton?.contains(e.target) || flyoutButton?.contains(e.target);
    if (!clickedButton) {
      dispatch(actions.closeElements(['colorPickerOverlay']));
    }
  };
  useOnClickOutside(overlayRef, onClickOutside);

  useLayoutEffect(() => {
    if (isOpen) {
      const onResize = () => {
        const overlayPosition = getOverlayPositionBasedOn('textColorButton', overlayRef);
        setPosition(overlayPosition);
      };
      onResize();

      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, [isOpen]);

  return createPortal(
    <DataElementWrapper
      data-element='colorPickerOverlay'
      className={classNames({
        ColorPickerOverlay: true,
        Popup: true,
        open: isOpen,
        closed: !isOpen
      })}
      style={position}
      ref={overlayRef}
    >
      <ColorPalette
        color={color}
        property='TextColor'
        onStyleChange={onStyleChange}
        useMobileMinMaxWidth
      />
    </DataElementWrapper>,
    getRootNode().getElementById(portalElementId),
  );
};

export default ColorPickerOverlay;