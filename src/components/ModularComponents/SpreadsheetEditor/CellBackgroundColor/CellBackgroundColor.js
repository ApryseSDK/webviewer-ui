import React, { useEffect } from 'react';
import actions from 'actions';
import ModularColorPicker from '../../ModularColorPicker/ModularColorPicker';
import { useDispatch , useSelector } from 'react-redux';
import DataElements from 'constants/dataElement';
import { FLYOUT_ITEM_TYPES } from 'constants/customizationVariables';
import PropTypes from 'prop-types';
import { getColorFromHex } from 'helpers/colorPickerHelper';
import selectors from 'selectors';
import setCellBackgroundColor from 'src/helpers/setCellBackgroundColor';
import { defaultBackgroundColor } from 'src/helpers/initialColorStates';

const CellBackgroundColor = (props) => {
  const { isFlyoutItem, dataElement = 'cell-background-color', defaultColor = defaultBackgroundColor, disabled, onKeyDownHandler } = props;
  const dispatch = useDispatch();

  const defaultRGBAColor = getColorFromHex(defaultColor);
  const currentBackGroundColor = useSelector((state) => selectors.getCellBackgroundColor(state));
  const currentRGBColor = getColorFromHex(currentBackGroundColor) || defaultRGBAColor;

  useEffect(() => {
    const flyout = {
      dataElement: DataElements.CELL_BACKGROUND_COLOR_FLYOUT,
      className: DataElements.CELL_BACKGROUND_COLOR_FLYOUT,
      items: [
        {
          dataElement: FLYOUT_ITEM_TYPES.CELL_BACKGROUND_COLOR,
          type: FLYOUT_ITEM_TYPES.CELL_BACKGROUND_COLOR,
          defaultColor: defaultRGBAColor,
        }
      ]
    };
    dispatch(actions.updateFlyout(flyout.dataElement, flyout));
  }, [isFlyoutItem]);

  const handleColorChange = (color) => {
    setCellBackgroundColor(color);
  };

  return (
    <ModularColorPicker
      isFlyoutItem={isFlyoutItem}
      dataElement={dataElement}
      onColorChange={handleColorChange}
      icon='ic-fill'
      label='spreadsheetEditor.cellBackgroundColor'
      toggleElement={DataElements.CELL_BACKGROUND_COLOR_FLYOUT}
      property='CellBackgroundColor'
      defaultColor={defaultRGBAColor}
      color={currentRGBColor}
      disabled={disabled}
      ariaTypeLabel={'spreadsheetEditor.backgroundLabel'}
      onKeyDownHandler={onKeyDownHandler}
    />
  );
};

CellBackgroundColor.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  defaultColor: PropTypes.object,
  disabled: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

export default CellBackgroundColor;