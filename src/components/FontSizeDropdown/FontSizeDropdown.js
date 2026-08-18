import React, { useEffect, useState } from 'react';
import useCore from 'hooks/useCore';
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
  displayEmpty: PropTypes.bool, // If true and fontSize is undefined/null, render a blank box instead of defaulting to 12pt
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
  fontSize: fontSizeProp,
  fontUnit = 'pt',
  maxFontSize = RENDER_ROWS_UPPER_LIMIT,
  initialFontValue = MIN_FONT_SIZE,
  initialMaxFontValue = maxFontSize,
  incrementMap = BREAKS_AND_INCREMENT,
  applyOnlyOnBlur = false,
  disabled = false,
  width,
  disableFocusing = false,
  displayEmpty = false,
}) => {
  const { core } = useCore();
  // Only treat the size as "empty" when the caller explicitly opts in via displayEmpty,
  // so other consumers that never pass it keep defaulting a missing fontSize to 12pt.
  const isEmpty = displayEmpty && (fontSizeProp === undefined || fontSizeProp === null);
  const fontSize = fontSizeProp ?? 12;
  let normalizedFontSize = '';

  if (!isEmpty) {
    normalizedFontSize = fontSize <= maxFontSize ? fontSize : 1;
  }

  const [sizes, setSizes] = useState([]);
  const [currentFontSize, setCurrentFontSize] = useState(normalizedFontSize);

  const isValidFontSize = (num, arr = []) => num && arr.indexOf(num) === -1 && num <= maxFontSize && num >= MIN_FONT_SIZE;
  useEffect(() => {
    if (isEmpty) {
      setCurrentFontSize('');
      return;
    }

    // update the font size indicator in Text Editing Panel
    if (core.getContentEditManager().isInContentEditMode()) {
      setCurrentFontSize(fontSize <= maxFontSize ? fontSize : 1);
    } else {
      setCurrentFontSize(fontSize);
    }
  }, [fontSize, isEmpty]);

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
    const sizesAsStrings = getNewNumbers(Math.floor(isEmpty ? initialFontValue : currentFontSize)).map((size) => `${size}`);
    setSizes(sizesAsStrings);
    // currentFontSize is intentionally omitted: it changes asynchronously (see the
    // sync effect above, which doesn't clamp to maxFontSize in the non-edit-mode
    // branch), and re-running this effect on every currentFontSize change would
    // pull that unclamped value into the options list. Only isEmpty toggling
    // should trigger a recompute.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty]);

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

  return applyOnlyOnBlur ? <div onBlur={blur} className="font-size-blur-wrapper">{dropdown}</div> : dropdown;
};

FontSizeDropdown.propTypes = propTypes;

export default FontSizeDropdown;
