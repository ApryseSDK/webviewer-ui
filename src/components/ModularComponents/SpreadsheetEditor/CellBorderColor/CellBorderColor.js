import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import ModularColorPicker from '../../ModularColorPicker/ModularColorPicker';
import DataElements from 'constants/dataElement';
import { FLYOUT_ITEM_TYPES } from 'constants/customizationVariables';
import { getUniqueBorderColors, getColorFromHex, parseColor } from 'helpers/colorPickerHelper';
import { defaultBorderColor } from 'src/helpers/initialColorStates';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import calculateActiveBorderButtons from 'src/helpers/calculateActiveBorderButtons';
import applyActiveBorders from 'src/helpers/applyActiveBorders';

const CellBorderColor = (props) => {
  // eslint-disable-next-line custom/no-hex-colors
  const { isFlyoutItem, dataElement = 'cell-border-color', defaultColor = defaultBorderColor, disabled, onKeyDownHandler } = props;
  const dispatch = useDispatch();

  const defaultRGBAColor = getColorFromHex(defaultColor);
  const activeCellBorderStyle = useSelector(selectors.getActiveCellBorderStyle);
  const selectedBorderStyleListOption = useSelector((state) => selectors.getSelectedBorderStyleListOption(state));
  const isSingleCell = useSelector((state) => selectors.getIsSingleCell(state));
  const activeCellBorderColors = getUniqueBorderColors(activeCellBorderStyle);
  const [borderColors, setBorderColors] = useState(defaultRGBAColor);

  useEffect(()=>{
    if (activeCellBorderColors.length === 0) {
      setBorderColors(defaultRGBAColor);
      dispatch(actions.setSelectedBorderColorOption(defaultColor));
    } else if (activeCellBorderColors.length === 1) {
      setBorderColors(getColorFromHex(activeCellBorderColors[0]));
      dispatch(actions.setSelectedBorderColorOption(activeCellBorderColors[0]));
    } else {
      setBorderColors(activeCellBorderColors.map(getColorFromHex));
      dispatch(actions.setSelectedBorderColorOption(null));
    }
  },[]);

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
    setBorderColors(color);
    const parsedColor = parseColor(color);
    dispatch(actions.setSelectedBorderColorOption(parsedColor));
    if (!isSingleCell) {
      // changing border color can only be applied immediately if a single cell is selected
      return;
    }
    const activeBorderButtons = calculateActiveBorderButtons(activeCellBorderStyle);
    applyActiveBorders(activeBorderButtons, selectedBorderStyleListOption, parsedColor);
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
      color={borderColors}
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