import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import actions from 'actions';
import ModularColorPicker from '../../ModularColorPicker/ModularColorPicker';
import DataElements from 'constants/dataElement';
import { FLYOUT_ITEM_TYPES } from 'constants/customizationVariables';
import { getColorFromHex } from 'helpers/colorPickerHelper';

const CellTextColor = (props) => {
  // eslint-disable-next-line custom/no-hex-colors
  const { isFlyoutItem, dataElement = 'cell-text-color', defaultColor='#000000', disabled, onKeyDownHandler } = props;
  const dispatch = useDispatch();

  const defaultRGBAColor = getColorFromHex(defaultColor);
  const [selectedColor, setSelectedColor] = useState(defaultRGBAColor);

  useEffect(() => {
    const flyout = {
      dataElement: DataElements.CELL_TEXT_COLOR_FLYOUT,
      className: DataElements.CELL_TEXT_COLOR_FLYOUT,
      items: [
        {
          dataElement: FLYOUT_ITEM_TYPES.CELL_TEXT_COLOR,
          type: FLYOUT_ITEM_TYPES.CELL_TEXT_COLOR,
          defaultColor: defaultRGBAColor,
        }
      ]
    };

    dispatch(actions.updateFlyout(flyout.dataElement, flyout));
  }, [isFlyoutItem]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <ModularColorPicker
      isFlyoutItem={isFlyoutItem}
      dataElement={dataElement}
      onColorChange={handleColorChange}
      icon='icon-tool-text-free-text'
      label='spreadsheetEditor.textColor'
      toggleElement={DataElements.CELL_TEXT_COLOR_FLYOUT}
      property='TextColor'
      defaultColor={defaultRGBAColor}
      color={selectedColor}
      disabled={disabled}
      ariaTypeLabel={'spreadsheetEditor.textLabel'}
      labelKey={'spreadsheetEditor.textColor'}
      onKeyDownHandler={onKeyDownHandler}
    />
  );
};

CellTextColor.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  defaultColor: PropTypes.object,
  disabled: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

export default CellTextColor;