import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { SketchPicker } from 'react-color';
import { Swipeable } from 'react-swipeable';

import './ColorPickerModal.scss';

const ColorPickerModal = ({ isDisabled, isOpen, color, closeModal, handleChangeSave, handleChangeCancel }) => {
  const [t] = useTranslation();
  const [selectedColor, setSelectedColor] = useState({});
  const modalClass = classNames({
    Modal: true,
    ColorPickerModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  useEffect(() => {
    const black = { r: 0, g: 0, b: 0, a: 1 };
    if (color && color.A !== 0){
      setSelectedColor({ r: color.R, g: color.G, b: color.B, a: 1 });
    } else {
      setSelectedColor(black);
    }
  }, [color]);

  const handleChangeComplete = newColor => {
    setSelectedColor(newColor.rgb);
  };

  const handleSave = () => {
    handleChangeSave(selectedColor);
  }

  return isDisabled ? null : (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <div className={modalClass} data-element="ColorPickerModal" onMouseDown={closeModal}>
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <SketchPicker
            color={selectedColor}
            disableAlpha={true}
            onChange={handleChangeComplete}
            presetColors={[]}
          />
          <div className="buttons">
            <button className="cancel-button" onClick={handleChangeCancel}>
              {t('action.cancel')}
            </button>
            <button className="save-button" onClick={handleSave}>
              {t('action.ok')}
            </button>
          </div>
        </div>
      </div>
    </Swipeable>
  );
};

export default ColorPickerModal;
