import React, { createRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { BASIC_PALETTE } from 'constants/commonColors';
import Tooltip from 'components/Tooltip';
import DataElements from 'constants/dataElement';
import { transparentIcon } from 'helpers/colorPickerHelper';

import './ColorPalette.scss';

const DEFAULT_GRID_COLS = 7;

const propTypes = {
  property: PropTypes.string.isRequired,
  color: PropTypes.object,
  hasPadding: PropTypes.bool,
  hasInitialFocus: PropTypes.bool,
  style: PropTypes.object,
  overridePalette2: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onStyleChange: PropTypes.func.isRequired,
  colorMapKey: PropTypes.string,
  onClose: PropTypes.func,
  disabled: PropTypes.bool,
  ariaTypeLabel: PropTypes.string,
  onKeyDownHandler: PropTypes.func,
};

const ColorPalette = ({
  property,
  color: activeColor,
  hasPadding,
  hasInitialFocus,
  style = {},
  overridePalette2,
  onStyleChange,
  colorMapKey,
  onClose,
  disabled = false,
  ariaTypeLabel = '',
  onKeyDownHandler,
}) => {

  const [
    overridePalette,
    isDisabled,
  ] = useSelector((state) => [
    selectors.getCustomElementOverrides(state, DataElements.COLOR_PALETTE),
    selectors.isElementDisabled(state, DataElements.COLOR_PALETTE),
  ]);

  const getActivePalette = () => {
    const allowTransparent = property !== 'TextColor' && property !== 'StrokeColor';

    let activePalette = overridePalette2 || overridePalette?.[colorMapKey] || overridePalette?.global || BASIC_PALETTE;
    if (!allowTransparent) {
      activePalette = activePalette.filter((p) => p?.toLowerCase() !== 'transparency');
    }

    return activePalette;
  };

  const [t] = useTranslation();
  const [palette, setPalette] = useState(getActivePalette());
  const [numberOfRows, setNumberOfRows] = useState(1);
  const [activeButton, setActiveButton] = useState(null);
  const [buttonRefs, setButtonRefs] = useState([]);

  const setColor = (color) => {
    let rgbaColor;
    if (!color || color === 'transparency') {
      rgbaColor = new window.Core.Annotations.Color(0, 0, 0, 0);
    } else {
      rgbaColor = new window.Core.Annotations.Color(color);
    }
    onStyleChange(property, rgbaColor);
  };

  const getRowColFromIndex = (buttonIndex) => {
    const rowIndex = parseInt((buttonIndex) / DEFAULT_GRID_COLS, 10);
    const colIndex = buttonIndex % DEFAULT_GRID_COLS;
    return { rowIndex, colIndex };
  };

  const getIndexFromRowCol = (rowIndex, colIndex) => {
    return rowIndex * DEFAULT_GRID_COLS + colIndex;
  };

  const moveFocus = (rowIndex, colIndex, deltaX, deltaY) => {
    let nextRowIndex = rowIndex + deltaY;
    let nextColIndex = colIndex + deltaX;

    if (nextRowIndex < 0) {
      nextRowIndex = numberOfRows - 1;
    }
    if (nextRowIndex >= numberOfRows) {
      nextRowIndex = 0;
    }
    if (nextColIndex < 0) {
      nextColIndex = DEFAULT_GRID_COLS - 1;
    }
    if (nextColIndex >= DEFAULT_GRID_COLS) {
      nextColIndex = 0;
    }

    let nextButtonIndex = getIndexFromRowCol(nextRowIndex, nextColIndex);

    if (nextButtonIndex >= 0 && nextButtonIndex < buttonRefs.length) {
      setActiveButton(buttonRefs[nextButtonIndex]);
      return;
    }

    // Locate the next button in the grid; however, this button might not exist if the total number of colors isn’t a multiple of 7, leaving gaps at the end of the grid.
    const lastButtonIndex = buttonRefs.length - 1;
    const { rowIndex: lastRowIndex, colIndex: lastColIndex } = getRowColFromIndex(lastButtonIndex);
    if (deltaX > 0) {
      nextColIndex = 0;
    }
    if (deltaX < 0) {
      nextColIndex = lastColIndex;
    }
    if (deltaY < 0) {
      nextRowIndex = lastRowIndex - 1;
    }
    if (deltaY > 0) {
      nextRowIndex = 0;
    }

    nextButtonIndex = getIndexFromRowCol(nextRowIndex, nextColIndex);
    setActiveButton(buttonRefs[nextButtonIndex]);
  };

  const onKeyDown = (buttonColor, buttonIndex) => (event) => {
    if (onKeyDownHandler) {
      onKeyDownHandler(event);
      return;
    }
    const { rowIndex, colIndex } = getRowColFromIndex(buttonIndex);
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        event.stopPropagation();
        moveFocus(rowIndex, colIndex, 1, 0);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        event.stopPropagation();
        moveFocus(rowIndex, colIndex, -1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        moveFocus(rowIndex, colIndex, 0, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        moveFocus(rowIndex, colIndex, 0, -1);
        break;
      case 'Enter':
        event.preventDefault();
        setColor(buttonColor);
        break;
      case 'Escape':
      case 'Tab':
        onClose?.();
        break;
      default:
        break;
    }
  };

  const isButtonSelected = (buttonColor) => {
    if (!activeColor?.toHexString?.()) {
      return false;
    }
    return (activeColor.toHexString().toLowerCase() === buttonColor) || (!activeColor.toHexString() && buttonColor === 'transparency');
  };

  useEffect(() => {
    const activePalette = getActivePalette();
    setPalette(activePalette.map((color) => color?.toLowerCase()));
    setNumberOfRows(Math.ceil(activePalette.length / DEFAULT_GRID_COLS));
    setButtonRefs(activePalette.map(() => createRef()));
  }, [property, overridePalette, overridePalette2, colorMapKey]);

  useEffect(() => {
    const initialActiveButton = palette.findIndex((buttonColor) => isButtonSelected(buttonColor));
    // Immediately focus on the button with the active color, if the palette is inside a flyout
    if (hasInitialFocus) {
      setActiveButton(buttonRefs[initialActiveButton]);
    }
  }, [buttonRefs, hasInitialFocus]);

  useEffect(() => {
    if (!activeButton?.current) {
      return;
    }
    activeButton.current.focus();
  }, [activeButton]);

  if (isDisabled) {
    return null;
  }

  const getColorButtonLabel = (buttonColor) => {
    let label = '';
    if (ariaTypeLabel) {
      label += `${t(ariaTypeLabel)} `;
    }
    label += `${t('option.colorPalette.colorLabel')} ${buttonColor.toUpperCase()}`;
    return label;
  };

  return (
    <div
      data-element={DataElements.COLOR_PALETTE}
      className={classNames({
        'ColorPalette': true,
        padding: hasPadding,
      })}
      style={style}
    >
      {palette.map((buttonColor, i) => (
        !buttonColor
          ? <div key={`color-${i + 1}`} className='dummy-cell' />
          : <Tooltip
            key={`color-${i + 1}`}
            content={getColorButtonLabel(buttonColor)}
            ref={buttonRefs[i]}
          >
            <button
              className='cell-container'
              aria-current={isButtonSelected(buttonColor)}
              aria-label={getColorButtonLabel(buttonColor)}
              onClick={() => setColor(buttonColor)}
              onKeyDown={onKeyDown(buttonColor, i)}
              disabled={disabled}
              aria-disabled={disabled}
            >
              <div
                className={classNames({
                  'cell-outer': true,
                  active: isButtonSelected(buttonColor),
                })}
              >
                <div
                  className='cell border'
                  style={{ backgroundColor: buttonColor }}
                >
                  {buttonColor === 'transparency' && transparentIcon}
                </div>
              </div>
            </button>
          </Tooltip>
      ))}
    </div>
  );
};

ColorPalette.propTypes = propTypes;

export default ColorPalette;