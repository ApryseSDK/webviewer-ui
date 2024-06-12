import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import core from 'core';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DataElementWrapper from 'components/DataElementWrapper';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';
import { restoreSelection, keepTextEditSelectionOnInputFocus } from './pdfEditHelper';
import getRootNode from 'helpers/getRootNode';

import './FontSizeDropdown.scss';
import debounce from 'lodash/debounce';

export const DEBOUNCE_TIME = 750;

const propTypes = {
  fontSize: PropTypes.number,
  fontUnit: PropTypes.string, // Ex: 'pt'
  onFontSizeChange: PropTypes.func.isRequired,
  maxFontSize: PropTypes.number,
  initialFontValue: PropTypes.number,
  initialMaxFontValue: PropTypes.number,
  incrementMap: PropTypes.object,
  onError: PropTypes.func, // Calls this with current error message string whenever it changes
  applyOnlyOnBlur: PropTypes.bool, // If true, apply the font size change only when the element loses focus
  disabled: PropTypes.bool,
  displayEmpty: PropTypes.bool, // Display empty box
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
  onFontSizeChange,
  fontSize = 12,
  fontUnit = 'pt',
  maxFontSize = RENDER_ROWS_UPPER_LIMIT,
  initialFontValue = MIN_FONT_SIZE,
  initialMaxFontValue = maxFontSize,
  incrementMap = BREAKS_AND_INCREMENT,
  onError = undefined,
  applyOnlyOnBlur = false,
  disabled = false,
  displayEmpty = false,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef();
  const iconButtonRef = useRef();
  const dropdownDivRef = useRef();
  const dropdownContainerRef = useRef();
  const [sizes, setSizes] = useState([]);
  const [error, setError] = useState(false);
  const [shouldBeEmpty, setShouldBeEmpty] = useState(displayEmpty);
  const [initialFontSize, setInitialFontSize] = useState(null);

  const onClickOutside = useCallback(() => {
    setOpen(false);
  }, []);
  useOnClickOutside(dropdownContainerRef, onClickOutside);

  const [currSize, setCurrSize] = useState(fontSize <= maxFontSize ? fontSize : 1);
  const setValue = (val) => {
    setShouldBeEmpty(false);
    setCurrSize(val);
  };

  const isValidNum = (num, arr = []) => num && arr.indexOf(num) === -1 && num <= maxFontSize && num >= MIN_FONT_SIZE;
  useEffect(() => {
    // update the font size indicator in Text Editing Panel
    if (core.getContentEditManager().isInContentEditMode()) {
      setCurrSize(fontSize <= maxFontSize ? fontSize : 1);
    }
    inputRef.current.value = focused ? fontSize : `${fontSize}pt`;
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
        isValidNum(higher, startArr) && startArr.push(higher);
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
    setSizes(getNewNumbers(Math.floor(currSize)));
  }, []);

  const sizeChange = async (inputElement) => {
    let newSize = inputElement.value;
    const { activeElement } = getRootNode();
    if (typeof newSize === 'string' && activeElement === inputElement) {
      // we are flooring to integers here following Adobe's font size behaviour
      newSize = Math.floor(parseFloat(newSize));
      inputElement.value = newSize;
    }
    if (currSize !== newSize) {
      if (typeof newSize !== 'number' || isNaN(newSize)) {
        return;
      }
      if (!inputElement.checkValidity()) {
        if (isValidNum(newSize)) {
          inputElement.validFontSize = newSize;
        }
        if (onError) {
          onError(`${t('option.stylePopup.invalidFontSize')}: ${MIN_FONT_SIZE} - ${maxFontSize}`);
          setError(true);
        }
        return;
      }
      setCurrSize(newSize);
      !applyOnlyOnBlur && onFontSizeChange(`${newSize}${fontUnit}`);
    } else if (currSize !== inputElement.value) {
      // update the input if it has decimal but floored to the same value as currSize.
      setCurrSize(newSize);
    }
    setError(false);
    onError && onError('');
  };
  const debouncedSizeChange = debounce(sizeChange, DEBOUNCE_TIME);
  // This prevents the debounce function from being re-created after re-rendering
  const cachedDebouncedSizeChange = useCallback((value) => debouncedSizeChange(value), []);
  useEffect(() => {
    if (applyOnlyOnBlur) {
      sizeChange(inputRef.current);
    } else {
      cachedDebouncedSizeChange(inputRef.current);
    }
    return () => debouncedSizeChange.cancel();
  }, [currSize]);
  const [focused, setFocused] = useState(false);
  const focus = (e) => {
    if (applyOnlyOnBlur) {
      const annot = core.getAnnotationManager().getSelectedAnnotations()[0];
      const id = annot?.getCustomData?.('contentEditBoxId');
      const editor = core.getContentEditManager().getContentBoxById(id)?.editor;
      editor && keepTextEditSelectionOnInputFocus(core);
      setInitialFontSize(e.target.value);
    }
    setFocused(true);
  };
  const blur = (e) => {
    applyOnlyOnBlur && restoreSelection();
    if (!e.target.checkValidity() || !currSize) {
      setCurrSize(e.target.validFontSize || MIN_FONT_SIZE);
    }
    setFocused(false);
    onError && onError(null);
    onError && setError(false);
    // Only call worker update when the font size is changed
    const fontSizeChanged = e.target.value !== initialFontSize && e.target.value > MIN_FONT_SIZE && e.target.value < maxFontSize;
    (applyOnlyOnBlur && fontSizeChanged) && onFontSizeChange(`${currSize}${fontUnit}`);
  };

  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      const children = dropdownDivRef.current.childNodes;
      const itemHeight = children[0].getBoundingClientRect().height;
      const divHeight = dropdownDivRef.current.getBoundingClientRect().height;
      let itemDistance = 0;
      for (const node of children) {
        if (node.innerText === `${Math.floor(fontSize)}pt`) {
          break;
        }
        itemDistance++;
      }
      dropdownDivRef.current.scrollTop = itemHeight * itemDistance - divHeight / 2;
      if (shouldBeEmpty) {
        dropdownDivRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, shouldBeEmpty]);
  const onClickDropdownItem = useCallback(
    (e, key) => {
      e.stopPropagation();
      setOpen(false);
      setFocused(false);
      setCurrSize(key);
      onFontSizeChange(`${key}${fontUnit}`);
      iconButtonRef?.current.focus();
    }, [fontUnit, onFontSizeChange]
  );

  const dropdownItems = useMemo(
    () => sizes.map((key) => {
      const active = displayEmpty ? false : key === Math.floor(currSize);
      return (
        <DataElementWrapper
          key={key}
          type="button"
          dataElement={`dropdown-item-${key}`}
          className={classNames('Dropdown__item', { active })}
          onClick={(e) => onClickDropdownItem(e, key)}
          tabIndex={isOpen ? undefined : -1}
        >
          {key + fontUnit}
        </DataElementWrapper>);
    }),
    [currSize, isOpen, onClickDropdownItem, fontUnit, sizes]
  );

  const onOpenDropdown = (e) => {
    e.preventDefault();
    if (!disabled) {
      setOpen(!isOpen);
    }
  };

  const isDisabled = disabled === true ? 'disabledText' : null;
  const className = error ? 'error' : isDisabled;

  let value = focused ? currSize : `${currSize}pt`;
  if (shouldBeEmpty) {
    value = '';
  }
  return (
    <div className="FontSizeDropdown">
      <input
        min={MIN_FONT_SIZE}
        max={maxFontSize}
        value = {value}
        onChange={(e) => setValue(e.target.value)}
        type={focused ? 'number' : 'string'}
        onFocus={focus}
        onBlur={blur}
        onSelectCapture={focus}
        ref={inputRef}
        disabled={disabled}
        className={className}
      />
      <div ref={dropdownContainerRef}>
        <div
          className={classNames('icon-button')}
          onClick={onOpenDropdown}
          onTouchEnd={onOpenDropdown}
          ref={iconButtonRef}
        >
          <Icon className={isDisabled} glyph={`icon-chevron-${isOpen ? 'up' : 'down'}`} />
        </div>
        <div
          className={classNames('Dropdown__items', { 'hidden': !isOpen })}
          role="listbox"
          ref={dropdownDivRef}
        >
          {dropdownItems}
        </div>
      </div>
    </div>
  );
};

FontSizeDropdown.propTypes = propTypes;

export default FontSizeDropdown;
