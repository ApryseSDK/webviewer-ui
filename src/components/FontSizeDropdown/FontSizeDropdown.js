import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './FontSizeDropdown.scss';
import Icon from "components/Icon";
import PropTypes from 'prop-types';
import classNames from "classnames";
import DataElementWrapper from "components/DataElementWrapper";
import useOnClickOutside from "hooks/useOnClickOutside";
import { useTranslation } from "react-i18next";

const propTypes = {
  fontSize: PropTypes.number,
  fontUnit: PropTypes.string, // Ex: 'pt'
  onFontSizeChange: PropTypes.func.isRequired,
  maxFontSize: PropTypes.number,
  incrementMap: PropTypes.object,
  // Calls this with current error message string whenever it changes
  onError:  PropTypes.func,
};

const MIN_FONT_SIZE = 1;
// Default maxFontSize
const RENDER_ROWS_UPPER_LIMIT = 128;
// Default increment map
const BREAKS_AND_INCREMENT = {
  0: 1,
  20: 2,
  48: 4,
};

const FontSizeDropdown = ({
  onFontSizeChange,
  fontSize = 12.0,
  fontUnit = "pt",
  maxFontSize = RENDER_ROWS_UPPER_LIMIT,
  incrementMap = BREAKS_AND_INCREMENT,
  onError = undefined,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef();
  const iconButtonRef = useRef();
  const dropdownDivRef = useRef();
  const [sizes, setSizes] = useState([]);
  const [error, setError] = useState(false);

  const onClickOutside = useCallback(() => {
    setOpen(false);
  }, []);
  useOnClickOutside(dropdownDivRef, onClickOutside);

  const [currSize, setCurrSize] = useState(fontSize < maxFontSize ? fontSize : 1);
  const isValidNum = (num, arr = []) =>
    num && arr.indexOf(num) === -1 && num <= maxFontSize && num >= MIN_FONT_SIZE;
  useEffect(() => {
    incrementMap[maxFontSize] = 12;
    const getNewNumbers = curr => {
      const startArr = [MIN_FONT_SIZE];
      for (let i = 1; i <= maxFontSize; i++) {
        const higherIncrement = getIncrement(startArr[startArr.length - 1]);
        const higher = (startArr[startArr.length - 1]) + higherIncrement;
        isValidNum(higher, startArr) && startArr.push(higher);
      }
      if (!startArr.includes(curr)) {
        startArr.push(curr);
        startArr.sort((a, b) => a - b);
      }
      return startArr;
    };
    const getIncrement = num => {
      let greaterThanLast = false;
      let last;
      const keys = Object.keys(incrementMap).map(i => parseFloat(i)).sort((a, b) => a - b);
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
  const sizeChange = e => {
    setFocused(true);
    const newValue = e.target.value;
    const newSize = typeof newValue === "string" ?
      parseFloat(newValue.replace(/[^\d]+/gi, ''))
      : newValue;
    if (currSize !== newSize) {
      if (typeof newSize !== "number") {
        return setCurrSize(MIN_FONT_SIZE);
      }
      setCurrSize(newSize);
      if (!e.target.checkValidity()) {
        if (isValidNum(currSize)) {
          e.target.validFontSize = currSize;
        }
        if (onError) {
          onError(t('option.stylePopup.invalidFontSize') + maxFontSize);
          setError(true);
        }
        return e.preventDefault();
      }
      setError(false);
      onError && onError('');
      onFontSizeChange(`${newSize}${fontUnit}`);
    }
  };

  const [focused, setFocused] = useState(false);
  const focus = () => setFocused(true);
  const blur = e => {
    if (!e.target.checkValidity() || !currSize) {
      setCurrSize(e.target.validFontSize || MIN_FONT_SIZE);
    }
    setFocused(false);
    onError && onError(null);
    onError && setError(false);
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
    }
  }, [isOpen]);
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
    () => sizes.map(key => (
      <DataElementWrapper
        key={key}
        type="button"
        dataElement={`dropdown-item-${key}`}
        className={classNames('Dropdown__item', { active: key === Math.floor(currSize) })}
        onClick={e => onClickDropdownItem(e, key)}
        tabIndex={isOpen ? undefined : -1}
      >
        {key + fontUnit}
      </DataElementWrapper>
    )),
    [currSize, isOpen, onClickDropdownItem, fontUnit, sizes]
  );

  return (
    <div className="FontSizeDropdown">
      <input
        min={MIN_FONT_SIZE}
        max={maxFontSize}
        value={focused ? currSize : `${currSize}pt`}
        onChange={sizeChange}
        type={focused ? "number" : "string"}
        onFocus={focus}
        onBlur={blur}
        onSelectCapture={focus}
        ref={inputRef}
        disabled={isOpen}
        className={error ? "error" : undefined}
      />
      <div
        className={classNames("icon-button")}
        onClick={() => setOpen(true)}
        ref={iconButtonRef}
      >
        <Icon
          glyph="icon-chevron-down"
        />
      </div>
      <div
        className={classNames('Dropdown__items', { 'hidden': !isOpen })}
        role="listbox"
        ref={dropdownDivRef}
      >
        {dropdownItems}
      </div>
    </div>
  );
};

FontSizeDropdown.propTypes = propTypes;

export default FontSizeDropdown;