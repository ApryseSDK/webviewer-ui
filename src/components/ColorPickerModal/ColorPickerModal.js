import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { SketchPicker } from 'react-color';
import DataElements from 'src/constants/dataElement';
import Button from 'components/Button';
import ModalWrapper from 'components/ModalWrapper';
import './ColorPickerModal.scss';
import useFocusOnClose from 'hooks/useFocusOnClose';

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
    const escFunction = (e) => {
      if (e.key === 'Escape') {
        e?.stopPropagation();
        e?.preventDefault();
        closeModalHandler();
      }
    };

    window.addEventListener('keydown', escFunction);
    return () => window.removeEventListener('keydown', escFunction);
  }, []);

  useEffect(() => {
    const black = { r: 0, g: 0, b: 0, a: 1 };
    if (color && color.A !== 0) {
      setSelectedColor({ r: color.R, g: color.G, b: color.B, a: 1 });
    } else {
      setSelectedColor(black);
    }
  }, [color]);

  const handleChangeComplete = (newColor) => {
    setSelectedColor(newColor.rgb);
  };

  const handleSave = () => {
    handleChangeSave(selectedColor);
  };

  const closeModalHandler = useFocusOnClose(closeModal);
  const handleChangeCancelWithFocus = useFocusOnClose(handleChangeCancel);
  const handleSaveWithFocus = useFocusOnClose(handleSave);

  return isDisabled ? null : (
    <div className={modalClass} data-element={DataElements.COLOR_PICKER_MODAL} onMouseDown={closeModal}>
      <ModalWrapper
        isOpen={isOpen}
        closeHandler={closeModalHandler}
        onCloseClick={closeModalHandler}
        swipeToClose
        accessibleLabel={'colorPickerModal.modalTitle'}
      >
        <div className="container" onMouseDown={(e) => e.stopPropagation()}>
          <SketchPicker
            color={selectedColor}
            disableAlpha
            onChange={handleChangeComplete}
            presetColors={[]}
          />
          <div className="buttons">
            <Button className="cancel-button" onClick={handleChangeCancelWithFocus} label={t('action.cancel')} />
            <Button className="save-button" onClick={handleSaveWithFocus} label={t('action.ok')} />
          </div>
        </div>
      </ModalWrapper >
    </div>
  );
};

export default ColorPickerModal;
