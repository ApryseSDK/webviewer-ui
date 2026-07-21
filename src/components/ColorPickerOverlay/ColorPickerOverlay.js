import React, { useState, useLayoutEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import DataElementWrapper from 'components/DataElementWrapper';
import ColorPalette from 'components/ColorPalette';
import actions from 'actions';
import useOnClickOutside from 'hooks/useOnClickOutside';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';

import DataElement from 'constants/dataElement';
import classNames from 'classnames';
import getRootNode from 'helpers/getRootNode';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';

import './ColorPickerOverlay.scss';

const propTypes = {
  color: PropTypes.object,
  onStyleChange: PropTypes.func,
  toggleButtonDataElement: PropTypes.string,
  portalElementId: PropTypes.string,
};

const ColorPickerOverlay = ({
  color,
  onStyleChange,
  toggleButtonDataElement,
  portalElementId = 'app',
}) => {
  const instanceRoot = useContext(InstanceRootNodeContext);
  const rootNode = instanceRoot || getRootNode();
  const [position, setPosition] = useState(() => ({ left: '555px', right: 'auto', top: 'auto' }));
  const overlayRef = useRef(null);
  const [
    isOpen,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, DataElement.OFFICE_EDITOR_COLOR_PICKER_OVERLAY),
  ]);

  const headerButtonDataElement = toggleButtonDataElement || DataElement.OFFICE_EDITOR_TEXT_COLOR_BUTTON;
  const flyoutButtonDataElement = toggleButtonDataElement || DataElement.OFFICE_EDITOR_FLYOUT_COLOR_PICKER;

  const dispatch = useDispatch();

  const onClose = () => dispatch(actions.closeElements([DataElement.OFFICE_EDITOR_COLOR_PICKER_OVERLAY]));

  const onClickOutside = (e) => {
    const headerButton = rootNode?.querySelector(`[data-element="${headerButtonDataElement}"]`);
    const flyoutButton = rootNode?.querySelector(`[data-element="${flyoutButtonDataElement}"]`);
    const clickedButton = headerButton?.contains(e.target) || flyoutButton?.contains(e.target);
    if (!clickedButton) {
      onClose();
    }
  };
  useOnClickOutside(overlayRef, onClickOutside, rootNode);

  useLayoutEffect(() => {
    if (isOpen) {
      const onResize = () => {
        const overlayPosition = getOverlayPositionBasedOn(headerButtonDataElement, overlayRef, false, rootNode);
        setPosition(overlayPosition);
      };
      onResize();

      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, [headerButtonDataElement, isOpen, rootNode]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <DataElementWrapper
      data-element={DataElement.OFFICE_EDITOR_COLOR_PICKER_OVERLAY}
      className={classNames({
        ColorPickerOverlay: true,
        Popup: true,
        open: isOpen,
        closed: !isOpen
      })}
      css={position}
      ref={overlayRef}
    >
      <ColorPalette
        color={color}
        property='TextColor'
        onStyleChange={onStyleChange}
        hasInitialFocus={true}
        useMobileMinMaxWidth
        onClose={onClose}
      />
    </DataElementWrapper>,
    rootNode.getElementById(portalElementId),
  );
};

ColorPickerOverlay.propTypes = propTypes;
export default ColorPickerOverlay;
