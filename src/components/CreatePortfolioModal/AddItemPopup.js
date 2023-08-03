import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PopupPortal from 'components/PopupPortal';
import Icon from 'components/Icon';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import useOnClickOutside from 'hooks/useOnClickOutside';
import getRootNode from 'helpers/getRootNode';

import './AddItemPopup.scss';

const AddItemPopup = ({ triggerElementName, onClose, onAddFiles, onAddFolder }) => {
  const [t] = useTranslation();
  const popupRef = useRef();
  const [position, setPosition] = useState({ left: 'auto', right: 'auto', top: 'auto' });

  useEffect(() => {
    const position = getOverlayPositionBasedOn(triggerElementName, popupRef);
    setPosition(position);
  }, []);

  useOnClickOutside(popupRef, (e) => {
    const addItemElement = getRootNode().querySelector(`[data-element=${triggerElementName}]`).parentElement;
    if (!addItemElement?.contains(e.target)) {
      onClose();
    }
  });

  return (
    <PopupPortal
      id="create-portfolio-add-item-portal"
      position={position}
    >
      <div
        className="add-portfolio-item-popup"
        ref={popupRef}
      >
        <div className="add-portfolio-item-popup-item" onClick={() => onAddFiles()}>
          <Icon glyph="icon-portfolio-file" />
          <div>{t('portfolio.addFiles')}</div>
        </div>
        <div className="add-portfolio-item-popup-item" onClick={() => onAddFolder()}>
          <Icon glyph="icon-portfolio-folder" />
          <div>{t('portfolio.addFolder')}</div>
        </div>
      </div>
    </PopupPortal>
  );
};

export default AddItemPopup;
