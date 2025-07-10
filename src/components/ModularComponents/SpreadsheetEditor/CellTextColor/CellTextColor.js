import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import actions from 'actions';
import ModularColorPicker from '../../ModularColorPicker/ModularColorPicker';
import DataElements from 'constants/dataElement';
import { FLYOUT_ITEM_TYPES } from 'constants/customizationVariables';
import { getColorFromHex } from 'helpers/colorPickerHelper';
import setCellFontStyle from 'helpers/setCellFontStyle';
import selectors from 'selectors';
import { defaultTextColor } from 'src/helpers/initialColorStates';

const CellTextColor = (props) => {
  const { isFlyoutItem, dataElement = 'cell-text-color', defaultColor = defaultTextColor, disabled, onKeyDownHandler } = props;
  const dispatch = useDispatch();

  const defaultRGBAColor = getColorFromHex(defaultColor);
  const currentTextColor = useSelector((state) => selectors.getActiveCellRangeFontStyle(state, 'color'));
  const currentRGBColor = getColorFromHex(currentTextColor) || defaultRGBAColor;

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
    setCellFontStyle({
      color: color
    });
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
      color={currentRGBColor}
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