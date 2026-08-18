import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useStore } from 'react-redux';
import { getEventHandler } from 'helpers/fireEvent';
import { COMMON_COLORS } from 'constants/commonColors';
import actions from 'src/redux/actions';
import selectors from 'selectors';
import Events from 'constants/events';
import PropTypes from 'prop-types';
import ColorPalettePicker from 'components/ColorPalettePicker/ColorPalettePicker'; // ColorPalletePicker inner import required as we are not using the redux outer container

// colorsArrayName is either 'TEXT_COLORS' or 'FILL_COLORS' depending on which color palette we are rendering
const ColorContainer = ({
  handleColorChange,
  colorsArrayName,
  type,
}) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const store = useStore();
  const [customColors, setCustomColors] = useState(window.Core.Tools.RubberStampCreateTool[colorsArrayName]);
  const [color, setColor] = useState(window.Core.Tools.RubberStampCreateTool[colorsArrayName][0]);
  const [colorToBeDeleted, setColorToBeDeleted] = useState(null);

  const handleColorOnClick = (newColor) => {
    setColor(newColor);
    handleColorChange(newColor);
  };

  const getHexColor = (givenColor) => {
    if (givenColor?.A) {
      return givenColor.toHexString().toLowerCase();
    }
    return COMMON_COLORS['black'];
  };

  const getCustomColorAndRemove = () => {
    const customColor = selectors.getCustomColor(store.getState());
    dispatch(actions.setCustomColor(null));
    return customColor;
  };

  const openColorPicker = () => {
    dispatch(actions.openElement('ColorPickerModal'));
    const handleVisibilityChanged = (element, isVisible) => {
      if (element === 'ColorPickerModal' && !isVisible) {
        const color = getCustomColorAndRemove();
        if (color) {
          const colorToBeAdded = getHexColor(color);
          setColor(colorToBeAdded);
          const toolColors = window.Core.Tools.RubberStampCreateTool[colorsArrayName];
          toolColors.push(colorToBeAdded);
          setCustomColors(toolColors);
          handleColorChange(colorToBeAdded);
        }
        getEventHandler().removeEventListener(Events.VISIBILITY_CHANGED, handleVisibilityChanged);
      }
    };
    getEventHandler().addEventListener(Events.VISIBILITY_CHANGED, handleVisibilityChanged);
  };

  const openDeleteModal = () => {
    const onConfirm = () => {
      const newColors = customColors.filter((color) => color !== colorToBeDeleted);
      setCustomColors(newColors);
      setColorToBeDeleted(null);
      window.Core.Tools.RubberStampCreateTool[colorsArrayName] = newColors;
    };
    const message = t('warning.colorPicker.deleteMessage');
    const title = t('warning.colorPicker.deleteTitle');
    const confirmBtnText = t('action.ok');
    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm,
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const label = type === 'text' ? t('option.customStampModal.textColor') : t('option.customStampModal.backgroundColor');
  const ariaLabelledBy = type === 'text' ? 'stamp-text-color-label' : 'stamp-background-color-label';

  const colorContainer = <div className="color-container">
    <div id={ariaLabelledBy} className="stamp-sublabel">
      {label || t('option.customStampModal.textColor')}
    </div>
    <div className="colorpalette-container">
      <ColorPalettePicker
        getHexColor={getHexColor}
        color={color}
        setColorToBeDeleted={setColorToBeDeleted}
        colorToBeDeleted={colorToBeDeleted}
        customColors={customColors}
        onStyleChange={setColor}
        handleColorOnClick={handleColorOnClick}
        handleOnClick={handleColorOnClick}
        openColorPicker={openColorPicker}
        openDeleteModal={openDeleteModal}
        ariaLabelledBy={ariaLabelledBy}
        toolTipXOffset={-7}
        disableTitle
        enableEdit
        colorsAreHex />
    </div>
  </div>;

  return colorContainer;
};

ColorContainer.propTypes = {
  handleColorChange: PropTypes.func,
  colorsArrayName: PropTypes.string,
  type: PropTypes.string,
};

export default ColorContainer;