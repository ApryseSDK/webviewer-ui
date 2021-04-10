import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

import DataElementWrapper from 'components/DataElementWrapper';
import ActionButton from 'components/ActionButton';
import OutlineContext from 'components/Outline/Context';

import useOnClickOutside from 'hooks/useOnClickOutside';
import outlineUtils from 'helpers/OutlineUtils';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';

import './OutlineEditPopup.scss';

const propTypes = {
  outline: PropTypes.object.isRequired,
  trigger: PropTypes.string.isRequired,
};

const Portal = ({ children, position }) => {
  const mount = document.getElementById('outline-edit-popup-portal');
  mount.style.position = 'absolute';
  mount.style.top = position.top === 'auto' ? position.top : `${position.top}px`
  mount.style.left = position.left === 'auto' ? position.left : `${position.left}px`
  mount.style.right = position.right === 'auto' ? position.right : `${position.right}px`
  mount.style.zIndex = 999;

  return createPortal(children, mount);
};

function OutlineEditPopup({ outline, trigger, setIsOpen, setIsEditingName }) {
  const { selectedOutlinePath, setSelectedOutlinePath, reRenderPanel } = useContext(OutlineContext);
  const [t] = useTranslation();
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ left: -100, right: 'auto', top: 'auto' });

  useEffect(() => {
    const position = getOverlayPositionBasedOn(trigger, containerRef);
    setPosition(position);
  }, [trigger]);

  const onClickOutside = useCallback(
    e => {
      const triggerButton = document.querySelector(`[data-element="${trigger}"]`);
      const clickedTriggerButton = triggerButton?.contains(e.target);
      if (!clickedTriggerButton) {
        setIsOpen(false);
      }
    },
    [setIsOpen, trigger],
  );

  useOnClickOutside(containerRef, onClickOutside);

  function renameOutline() {
    setIsEditingName(true);
  }

  async function deleteOutline() {
    const fullIndex = outlineUtils.getPath(outline);
    await outlineUtils.deleteOutline(fullIndex);

    reRenderPanel();
    if (fullIndex === selectedOutlinePath) {
      setSelectedOutlinePath(null);
    }
  }

  return (
    <Portal position={position}>
      <DataElementWrapper ref={containerRef} className="OutlineEditPopup" dataElement="outlineEditPopup">
        <ActionButton
          dataElement="renameOutlineButton"
          img="icon-header-annotation-fill"
          label={t('action.rename')}
          ariaLabel={t('action.rename')}
          role="option"
          onClick={renameOutline}
        />
        <ActionButton
          dataElement="deleteOutlineButton"
          img="icon-delete-line"
          label={t('action.delete')}
          ariaLabel={t('action.delete')}
          role="option"
          onClick={deleteOutline}
        />
      </DataElementWrapper>
    </Portal>
  );
}

OutlineEditPopup.propTypes = propTypes;

export default OutlineEditPopup;
