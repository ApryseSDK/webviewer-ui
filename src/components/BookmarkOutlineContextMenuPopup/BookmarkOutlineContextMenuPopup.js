import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import DataElementWrapper from 'components/DataElementWrapper';

import useOnClickOutside from 'hooks/useOnClickOutside';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';

import './BookmarkOutlineContextMenuPopup.scss';
import Button from '../Button';

const propTypes = {
  type: PropTypes.oneOf(['bookmark', 'outline']).isRequired,
  anchorButton: PropTypes.string.isRequired,
  shouldDisplayDeleteButton: PropTypes.bool,
  onClosePopup: PropTypes.func.isRequired,
  onRenameClick: PropTypes.func,
  onSetDestinationClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

const BookmarkOutlineContextMenuPopup = ({
  type,
  anchorButton,
  shouldDisplayDeleteButton,
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
    mount.style.top = position.top === 'auto' ? position.top : `${position.top}px`;
    mount.style.left = position.left === 'auto' ? position.left : `${position.left}px`;
    mount.style.right = position.right === 'auto' ? position.right : `${position.right}px`;
    mount.style.zIndex = 999;

    return createPortal(children, mount);
  };

  useEffect(() => {
    const position = getOverlayPositionBasedOn(anchorButton, containerRef);
    setPosition(position);
  }, [anchorButton]);

  const onClickOutside = useCallback((e) => {
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
          onClick={(e) => {
            e.stopPropagation();
            onRenameClick();
          }}
        />
        {type === 'outline' &&
          <Button
            className="option-button"
            dataElement={`${type}SetDestinationButton`}
            img="icon-thumbtack"
            label={t('action.setDestination')}
            ariaLabel={t('action.setDestination')}
            onClick={(e) => {
              e.stopPropagation();
              onSetDestinationClick();
            }}
          />
        }
        {shouldDisplayDeleteButton &&
          <Button
            className="option-button"
            dataElement={`${type}DeleteButton`}
            img="icon-delete-line"
            label={t('action.delete')}
            ariaLabel={t('action.delete')}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
          />
        }
      </DataElementWrapper>
    </Portal>
  );
};

BookmarkOutlineContextMenuPopup.propTypes = propTypes;

export default BookmarkOutlineContextMenuPopup;
