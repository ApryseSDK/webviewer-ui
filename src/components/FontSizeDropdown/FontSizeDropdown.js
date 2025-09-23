import React, { useEffect, useState } from 'react';
import core from 'core';
import PropTypes from 'prop-types';
import { restoreSelection, keepTextEditSelectionOnInputFocus } from './pdfEditHelper';
import Dropdown from 'components/Dropdown';

import './FontSizeDropdown.scss';

export const DEBOUNCE_TIME = 750;

const propTypes = {
  dataElement: PropTypes.string,
  fontSize: PropTypes.number,
  fontUnit: PropTypes.string, // Ex: 'pt'
  onFontSizeChange: PropTypes.func.isRequired,
  maxFontSize: PropTypes.number,
  initialFontValue: PropTypes.number,
  initialMaxFontValue: PropTypes.number,
  incrementMap: PropTypes.object,
  applyOnlyOnBlur: PropTypes.bool, // If true, apply the font size change only when the element loses focus
  disabled: PropTypes.bool,
  width: PropTypes.number,
  disableFocusing: PropTypes.bool,
};

const MIN_FONT_SIZE = 1;
// Default maxFontSize
const RENDER_ROWS_UPPER_LIMIT = 512;
// Default increment map
const BREAKS_AND_INCREMENT = {
  0: 1,
  20: 2,
  48: 4,
};

const FontSizeDropdown = ({
  dataElement,
  onFontSizeChange,
  fontSize = 12,
  fontUnit = 'pt',
  maxFontSize = RENDER_ROWS_UPPER_LIMIT,
  initialFontValue = MIN_FONT_SIZE,
  initialMaxFontValue = maxFontSize,
  incrementMap = BREAKS_AND_INCREMENT,
  applyOnlyOnBlur = false,
  disabled = false,
  width,
  disableFocusing = false,
}) => {
  const [sizes, setSizes] = useState([]);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize <= maxFontSize ? fontSize : 1);

  const isValidFontSize = (num, arr = []) => num && arr.indexOf(num) === -1 && num <= maxFontSize && num >= MIN_FONT_SIZE;
  useEffect(() => {
    // update the font size indicator in Text Editing Panel
    if (core.getContentEditManager().isInContentEditMode()) {
      setCurrentFontSize(fontSize <= maxFontSize ? fontSize : 1);
    } else {
      setCurrentFontSize(fontSize);
    }
  }, [fontSize]);

  useEffect(() => {
    incrementMap[maxFontSize] = 12;
    const getNewNumbers = (curr) => {
      const startArr = [initialFontValue];
      for (let i = 1; i <= RENDER_ROWS_UPPER_LIMIT; i++) {
        const higherIncrement = getIncrement(startArr[startArr.length - 1]);
        const higher = (startArr[startArr.length - 1]) + higherIncrement;
        if (higher > initialMaxFontValue) {
          break;
        }
        isValidFontSize(higher, startArr) && startArr.push(higher);
      }
      if (!startArr.includes(curr)) {
        startArr.push(curr);
        startArr.sort((a, b) => a - b);
      }
      return startArr;
    };
    const getIncrement = (num) => {
      let greaterThanLast = false;
      let last;
      const keys = Object.keys(incrementMap).map((i) => parseFloat(i)).sort((a, b) => a - b);
      for (const i of keys) {
        if (num < i && greaterThanLast) {
          return incrementMap[last];
        }
        if (i === keys[keys.length - 1]) {
          return incrementMap[i];
        }
        if (num >= i) {
          greaterThanLast = true;
          last = i;
        }
      }
    };
    const sizesAsStrings = getNewNumbers(Math.floor(currentFontSize)).map((size) => `${size}`);
    setSizes(sizesAsStrings);
  }, []);

  const sizeChange = (newSize) => {
    //Check for NAN and outside the range
    if (isNaN(newSize) || !isValidFontSize(newSize)) {
      //No size change
      return;
    }

    // If size is different from the current size
    if (currentFontSize !== newSize) {
      setCurrentFontSize(newSize);
      onFontSizeChange(`${newSize}${fontUnit}`);
    }
  };

  const focus = () => {
    if (applyOnlyOnBlur) {
      const annot = core.getAnnotationManager().getSelectedAnnotations()[0];
      const id = annot?.getCustomData?.('contentEditBoxId');
      const editor = core.getContentEditManager().getContentBoxById(id)?.editor;
      editor && keepTextEditSelectionOnInputFocus(core);
    }
  };
  const blur = () => {
    applyOnlyOnBlur && restoreSelection();
  };

  const onClickDropdownItem = (key) => {
    // no floating point numbers
    const sizeAsNumber = parseInt(key, 10);
    sizeChange(sizeAsNumber);
  };

  const currentKeyAsString = `${currentFontSize}`;

  const dropdown = (
    <Dropdown
      id="FontSizeDropdown"
      dataElement={dataElement}
      disableFocusing={disableFocusing}
      showLabelInList
      items={sizes}
      isSearchEnabled={false}
      onClickItem={onClickDropdownItem}
      currentSelectionKey={currentKeyAsString}
      maxHeight={200}
      hasInput
      onFocus={focus}
      disabled={disabled}
      translationPrefix='officeEditor.fontSize'
      width={width}
    />
  );

  return applyOnlyOnBlur ? <div onBlur={blur} style={{ width: '100%' }}>{dropdown}</div> : dropdown;
};

FontSizeDropdown.propTypes = propTypes;

export default FontSizeDropdown;
