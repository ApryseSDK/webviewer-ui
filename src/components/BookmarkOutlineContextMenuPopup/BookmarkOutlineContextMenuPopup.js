import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

import DataElementWrapper from 'components/DataElementWrapper';

import useOnClickOutside from 'hooks/useOnClickOutside';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';

import './BookmarkOutlineContextMenuPopup.scss';
import Button from '../Button';


const BookmarkOutlineContextMenuPopup = ({
  type,
  anchorButton,
  onClosePopup,
  onRenameClick,
  onSetDestinationClick,
  onDeleteClick,
}) => {
  const [t] = useTranslation();
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ left: -100, right: 'auto', top: 'auto' });

  const Portal = ({ children, position }) => {
    const mount = document.getElementById('outline-edit-popup-portal');
    mount.style.position = 'absolute';
    mount.style.top = position.top === 'auto' ? position.top : `${position.top}px`
    mount.style.left = position.left === 'auto' ? position.left : `${position.left}px`
    mount.style.right = position.right === 'auto' ? position.right : `${position.right}px`
    mount.style.zIndex = 999;

    return createPortal(children, mount);
  };

  useEffect(() => {
    const position = getOverlayPositionBasedOn(anchorButton, containerRef);
    setPosition(position);
  }, [anchorButton]);

  const onClickOutside = useCallback(e => {
    if (!containerRef?.current.contains(e.target)) {
      onClosePopup();
    }
  });

  useOnClickOutside(containerRef, onClickOutside);

  return (
    <Portal position={position}>
      <DataElementWrapper
        ref={containerRef}
        className="bookmark-outline-context-menu-popup"
        dataElement={`${type}EditPopup`}
      >
        <Button
          className="option-button"
          dataElement={`${type}RenameButton`}
          img="ic_edit_page_24px"
          label={t('action.rename')}
          ariaLabel={t('action.rename')}
          onClick={e => onRenameClick(e)}
        />
        {type === "outline" &&
          <Button
            className="option-button"
            dataElement={`${type}RenameButton`}
            img="icon-thumbtack"
            label={t('action.setDestination')}
            ariaLabel={t('action.setDestination')}
            onClick={() => onSetDestinationClick(type)}
          />
        }
        <Button
          className="option-button"
          dataElement={`${type}DeleteButton`}
          img="icon-delete-line"
          label={t('action.delete')}
          ariaLabel={t('action.delete')}
          onClick={e => onDeleteClick(e)}
        />
      </DataElementWrapper>
    </Portal>
  );
}

export default BookmarkOutlineContextMenuPopup;
