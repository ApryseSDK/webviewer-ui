import React, { useState, useEffect } from 'react';
import selectors from 'selectors';
import actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ColorPalettePicker from './ColorPalettePicker';

function ColorPickerModalRedux(props) {
  const { property, onStyleChange, color, enableEdit, ...rest } = props;

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const [modifyColorMode, setModifyColorMode] = useState('');
  const [colorToBeDeleted, setColorToBeDeleted] = useState('');

  const activeCustomColor = useSelector(selectors.getCustomColor);
  const customColors = useSelector(selectors.getCustomColors);

  useEffect(() => {
    if (activeCustomColor && color && (modifyColorMode || getHexColor(activeCustomColor) === getHexColor(color))) {
      handleColorChange(activeCustomColor);
    }
  }, [activeCustomColor, modifyColorMode]);

  const handleDeleteColor = () => {
    const updatedCustomColors = customColors.filter((color) => color !== colorToBeDeleted);
    dispatch(actions.setCustomColors(updatedCustomColors));
    setColorToBeDeleted('');
    dispatch(actions.setCustomColor(null));
  };

  const getHexColor = (givenColor) => {
    if (givenColor && givenColor.A) {
      return givenColor.toHexString().toLowerCase();
    }
    return '#000000';
  };

  const openColorPicker = (addNew) => {
    addNew ? setModifyColorMode('add') : setModifyColorMode('update');
    dispatch(actions.openElement('ColorPickerModal'));
  };

  const openDeleteModal = async () => {
    const message = t('warning.colorPicker.deleteMessage');
    const title = t('warning.colorPicker.deleteTitle');
    const confirmBtnText = t('action.ok');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: async () => {
        handleDeleteColor();
      },
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const handleColorChange = (newColor) => {
    if (newColor) {
      const newColorHex = getHexColor(newColor);
      const newColorExist = customColors.includes(newColorHex);
      const selectedColorindex = customColors.indexOf(color?.toHexString?.()?.toLowerCase() || '');
      // if add an new color or selected some pre-defined color
      if (modifyColorMode === 'add') {
        // add to the list if the new color doesn't exist
        if (!newColorExist) {
          dispatch(actions.setCustomColors([...customColors, newColorHex]));
        }
        // if the new color exist, then auto-selected it using (onStyleChange)
      } else if (modifyColorMode === 'update') {
        // if edit an existing color
        // if the new color doesn't exist, then we replace it on the selected color spot
        if (!newColorExist) {
          const updatedCustomColors = [...customColors];
          updatedCustomColors[selectedColorindex] = newColorHex;
          dispatch(actions.setCustomColors(updatedCustomColors));
        }
        // if the new color does exist then selected the existing one using (onStyleChange)
      }
      onStyleChange(property, newColor);
    }
  };

  const handleColorOnClick = (newColor) => {
    onStyleChange(property, new window.Annotations.Color(newColor));
    if (color && color.A !== 0 && color.toHexString().toLowerCase() && newColor === color.toHexString().toLowerCase()) {
      dispatch(actions.setCustomColor(color));
      if (enableEdit) {
        openColorPicker(false);
      }
    }
  };

  const newProps = {
    ...rest,
    color,
    property,
    getHexColor,
    handleColorOnClick,
    customColors,
    openColorPicker,
    colorToBeDeleted,
    setColorToBeDeleted,
    openDeleteModal,
    enableEdit,
  };
  return <ColorPalettePicker {...newProps} />;
}

export default ColorPickerModalRedux;
