import React, { useCallback } from 'react';
import ColorPickerModal from './ColorPickerModal';

function ColorPickerModalContainer(props) {
  const { closeColorPicker, onColorChange, ...rest } = props;

  const closeModal = useCallback(() => {
    closeColorPicker();
  }, [closeColorPicker]);

  const handleChangeSave = (selectedColor) => {
    onColorChange(selectedColor);
    closeColorPicker();
  };

  const handleChangeCancel = useCallback(() => {
    closeColorPicker();
  }, [closeColorPicker]);

  const newProps = {
    ...rest,
    closeModal,
    handleChangeSave,
    handleChangeCancel,
  };

  return <ColorPickerModal {...newProps} />;
}

export default ColorPickerModalContainer;
