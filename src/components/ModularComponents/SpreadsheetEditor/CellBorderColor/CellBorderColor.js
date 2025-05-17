import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import ModularColorPicker from '../../ModularColorPicker/ModularColorPicker';
import DataElements from 'constants/dataElement';
import { FLYOUT_ITEM_TYPES } from 'constants/customizationVariables';
import { getColorFromHex } from 'helpers/colorPickerHelper';
import PropTypes from 'prop-types';


const CellBorderColor = (props) => {
  // eslint-disable-next-line custom/no-hex-colors
  const { isFlyoutItem, dataElement = 'cell-border-color', defaultColor='#000000', disabled, onKeyDownHandler } = props;
  const dispatch = useDispatch();

  const defaultRGBAColor = getColorFromHex(defaultColor);
  const [selectedColor, setSelectedColor] = useState(getColorFromHex(defaultRGBAColor));

  useEffect(() => {
    const flyout = {
      dataElement: DataElements.CELL_BORDER_COLOR_FLYOUT,
      className: DataElements.CELL_BORDER_COLOR_FLYOUT,
      items: [
        {
          dataElement: FLYOUT_ITEM_TYPES.CELL_BORDER_COLOR,
          type: FLYOUT_ITEM_TYPES.CELL_BORDER_COLOR,
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
      icon='ic-border-color'
      label={'spreadsheetEditor.cellBorderColor'}
      toggleElement={DataElements.CELL_BORDER_COLOR_FLYOUT}
      property='BorderColor'
      defaultColor={defaultRGBAColor}
      color={selectedColor}
      disabled={disabled}
      ariaTypeLabel={'spreadsheetEditor.borderLabel'}
      onKeyDownHandler={onKeyDownHandler}
    />
  );
};

CellBorderColor.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  defaultColor: PropTypes.object,
  disabled: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

export default CellBorderColor;