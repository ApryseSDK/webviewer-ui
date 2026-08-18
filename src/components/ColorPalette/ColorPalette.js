import React, { createRef, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { BASIC_PALETTE } from 'constants/commonColors';
import Tooltip from 'components/Tooltip';
import DataElements from 'constants/dataElement';
import { transparentIcon } from 'helpers/colorPickerHelper';
import { getWrappedGridPosition, GRID_STEP_BY_DIRECTION, GRID_DIRECTION } from 'helpers/gridNavigationHelper';

import './ColorPalette.scss';
import { css } from '@emotion/react';

const DEFAULT_GRID_COLS = 7;

const propTypes = {
  property: PropTypes.string.isRequired,
  color: PropTypes.object,
  hasPadding: PropTypes.bool,
  hasInitialFocus: PropTypes.bool,
  style: PropTypes.object,
  overridePalette2: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onStyleChange: PropTypes.func.isRequired,
  onDefaultColorReset: PropTypes.func,
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
  onDefaultColorReset,
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
  const resetButtonRef = useRef(null);

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

  const moveFocus = (rowIndex, colIndex, direction) => {
    let { nextRowIndex, nextColIndex } = getWrappedGridPosition(rowIndex, colIndex, direction, numberOfRows, DEFAULT_GRID_COLS);

    let nextButtonIndex = getIndexFromRowCol(nextRowIndex, nextColIndex);

    if (nextButtonIndex >= 0 && nextButtonIndex < buttonRefs.length) {
      setActiveButton(buttonRefs[nextButtonIndex]);
      return;
    }

    // Locate the next button in the grid; however, this button might not exist if the total number of colors isn’t a multiple of 7, leaving gaps at the end of the grid.
    const { deltaRow, deltaCol } = GRID_STEP_BY_DIRECTION[direction];
    const lastButtonIndex = buttonRefs.length - 1;
    const { rowIndex: lastRowIndex, colIndex: lastColIndex } = getRowColFromIndex(lastButtonIndex);
    if (deltaCol > 0) {
      nextColIndex = 0;
    }
    if (deltaCol < 0) {
      nextColIndex = lastColIndex;
    }
    if (deltaRow < 0) {
      nextRowIndex = lastRowIndex - 1;
    }
    if (deltaRow > 0) {
      nextRowIndex = 0;
    }

    nextButtonIndex = getIndexFromRowCol(nextRowIndex, nextColIndex);
    setActiveButton(buttonRefs[nextButtonIndex]);
  };

  const getFirstSwatchIndex = () => palette.findIndex((buttonColor) => !!buttonColor);

  const getLastSwatchIndex = () => {
    for (let i = palette.length - 1; i >= 0; i--) {
      if (palette[i]) {
        return i;
      }
    }
    return -1;
  };

  const focusSwatchByIndex = (index) => {
    if (index >= 0 && index < buttonRefs.length) {
      setActiveButton(buttonRefs[index]);
    }
  };

  // Keyboard navigation for the optional "Reset to default" button, which sits
  // full-width above the swatch grid. It participates in the same vertical cycle:
  // top swatch row -> reset -> bottom swatch row.
  const onResetButtonKeyDown = (event) => {
    if (onKeyDownHandler) {
      onKeyDownHandler(event);
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        focusSwatchByIndex(getFirstSwatchIndex());
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        focusSwatchByIndex(getLastSwatchIndex());
        break;
      case 'Escape':
      case 'Tab':
        onClose?.();
        break;
      default:
        break;
    }
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
        moveFocus(rowIndex, colIndex, GRID_DIRECTION.RIGHT);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        event.stopPropagation();
        moveFocus(rowIndex, colIndex, GRID_DIRECTION.LEFT);
        break;
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        if (onDefaultColorReset && rowIndex === numberOfRows - 1) {
          setActiveButton(resetButtonRef);
        } else {
          moveFocus(rowIndex, colIndex, GRID_DIRECTION.DOWN);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        if (onDefaultColorReset && rowIndex === 0) {
          setActiveButton(resetButtonRef);
        } else {
          moveFocus(rowIndex, colIndex, GRID_DIRECTION.UP);
        }
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
    if (!hasInitialFocus) {
      return;
    }
    // Focus button or reset button if it exists, otherwise focus the first swatch.
    const initialActiveButton = palette.findIndex((buttonColor) => isButtonSelected(buttonColor));
    if (initialActiveButton >= 0) {
      setActiveButton(buttonRefs[initialActiveButton]);
      return;
    }
    if (onDefaultColorReset) {
      setActiveButton(resetButtonRef);
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
      css={css({
        ...style
      })}
    >
      {onDefaultColorReset && (
        <button
          ref={resetButtonRef}
          type='button'
          className='Button resetToDefaultColor'
          data-element={DataElements.OFFICE_EDITOR_HIGHLIGHT_RESET_TO_DEFAULT_BUTTON}
          aria-label={t('action.resetDefault')}
          title={t('action.resetDefault')}
          onClick={onDefaultColorReset}
          onKeyDown={onResetButtonKeyDown}
        >
          {t('action.resetDefault')}
        </button>
      )}
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
                  css={css({
                    backgroundColor: buttonColor
                  })}
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