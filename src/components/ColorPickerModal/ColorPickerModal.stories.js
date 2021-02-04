import React from 'react';
import ColorPickerModal from './ColorPickerModal';

export default {
  title: 'Components/ColorPickerModal',
  component: ColorPickerModal,
};

export function Basic() {
  const color = { R: 100, G: 0, B: 0, A: 1 };

  function closeModal() {
    console.log('closeModal');
  }

  function handleChangeSave() {
    console.log('handleChangeSave');
  }

  function handleChangeCancel() {
    console.log('handleChangeCancel');
  }
  const props = {
    isOpen: true,
    color,
    closeModal,
    handleChangeSave,
    handleChangeCancel,
  };
  return (
    <div>
      <ColorPickerModal {...props} />
    </div>
  );
}
