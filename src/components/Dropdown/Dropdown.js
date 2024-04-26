import core from 'core';
import classNames from 'classnames';
import Icon from 'components/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import useArrowFocus from '../../hooks/useArrowFocus';

import './Dropdown.scss';

const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 28;
const directionMap = {
  'up': 'down',
  'down': 'up',
  'left': 'right',
  'right': 'left',
};

const propTypes = {
  items: PropTypes.array,
  images: PropTypes.array,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  columns: PropTypes.number,
  currentSelectionKey: PropTypes.string,
  translationPrefix: PropTypes.string,
  getTranslationLabel: PropTypes.func,
  onClickItem: PropTypes.func,
  dataElement: PropTypes.string,
  disabled: PropTypes.bool,
  getCustomItemStyle: PropTypes.func,
  applyCustomStyleToButton: PropTypes.bool,
  placeholder: PropTypes.string,
  maxHeight: PropTypes.number,
  getKey: PropTypes.func,
  getDisplayValue: PropTypes.func,
  className: PropTypes.string,
  onOpened: PropTypes.func,
  arrowDirection: PropTypes.string,
  disableFocusing: PropTypes.bool,
  renderItem: PropTypes.func,
  renderSelectedItem: PropTypes.func,
};

function Dropdown({
  items = [],
  images = [],
  width = width || DEFAULT_WIDTH,
  height,
  columns = 1,
  currentSelectionKey,
  translationPrefix,
  getTranslationLabel,
  onClickItem = () => {},
  dataElement,
  disabled = false,
  applyCustomStyleToButton = true,
  getCustomItemStyle = () => ({}),
  placeholder = null,
  maxHeight,
  getKey = (item) => item,
  getDisplayValue = (item) => item,
  className = '',
  hasInput = false,
  displayButton = null,
  customDataValidator = () => true,
  isSearchEnabled = true,
  onOpened = () => {},
  arrowDirection = 'down',
  children,
  disableFocusing = false,
  renderItem = (item, getTranslatedDisplayValue) => (<>{getTranslatedDisplayValue(item)}</>),
  renderSelectedItem = (item, getTranslatedDisplayValue) => (<>{getTranslatedDisplayValue(item)}</>),
}) {
  const { t, ready: tReady } = useTranslation();
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const hasImages = images && images.length > 0;
  if (hasImages) {
    getKey = (item) => item.key;
  }

  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback((e) => {
    if (hasInput && e.target === inputRef?.current) {
      return;
    }

    e.preventDefault();

    if (disabled) {
      setIsOpen(false);
    } else {
      setIsOpen((prev) => !prev);
    }

    if (hasInput && !isOpen) {
      setTimeout(() => {
        inputRef?.current?.focus();
      });
    }

    // Keep the dropdown within the bounds of the viewer.
    const overlayBounds = overlayRef?.current?.getBoundingClientRect();
    const buttonBounds = buttonRef?.current?.getBoundingClientRect();
    let scrollViewRect = overlayRef?.current?.closest('body')?.getBoundingClientRect();
    if (core && core.getDocumentViewer()) {
      scrollViewRect = core.getScrollViewElement().getBoundingClientRect();
    }
    if (overlayBounds && !isOpen) {
      const horizontalOpening = arrowDirection === 'left' || arrowDirection === 'right';
      const bottomTop = scrollViewRect.top <= overlayBounds.top && scrollViewRect.top <= buttonBounds.top - overlayBounds.height;
      const topBottom = scrollViewRect.bottom >= overlayBounds.bottom && scrollViewRect.bottom >= buttonBounds.bottom + overlayBounds.height;
      const offset = horizontalOpening ? buttonBounds.height : 0;
      // Check for containment vertically only.
      if (bottomTop && topBottom) {
        // Still inside the viewer, no need to adjust.
        overlayRef.current.style.top = `${buttonBounds.height - offset}px`;
      } else {
        // If the overlay is past the bottom of the viewer, move it to the top instead.
        if (overlayBounds.bottom > scrollViewRect.bottom || buttonBounds.bottom + overlayBounds.height > scrollViewRect.bottom) {
          overlayRef.current.style.top = `-${overlayBounds.height - offset}px`;
        } else {
          // Otherwise the overlay is past the top of the viewer, move it to the bottom instead.
          overlayRef.current.style.top = `${buttonBounds.height - offset}px`;
        }
      }
      if (arrowDirection === 'left') {
        overlayRef.current.style.left = `-${buttonBounds.width}px`;
      }
      if (arrowDirection === 'right') {
        overlayRef.current.style.left = `${buttonBounds.width}px`;
      }
    } else {
      overlayRef.current.style.top = '';
    }
  }, [hasInput, isOpen, disabled]);

  useEffect(() => {
    if (!isOpen && overlayRef?.current) {
      // Always reset style when closing to prevent height calculations from being off.
      overlayRef.current.style.top = '';
      // Scroll to the top of list when closing.
      overlayRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  // Close dropdown if WebViewer loses focus (ie, user clicks outside iframe).
  useEffect(() => {
    const onBlur = () => {
      setIsOpen(false);
    };
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setInputVal('');
    } else {
      onOpened();
    }

    if (isOpen && hasInput && inputRef?.current) {
      inputRef.current.value = currentSelectionKey;
      inputRef.current.select();
    }
  }, [isOpen]);

  useArrowFocus(isOpen, onClose, overlayRef);

  const onClickOutside = useCallback((e) => {
    if (!buttonRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);
  useOnClickOutside(overlayRef, onClickOutside);

  const onClickDropdownItem = useCallback(
    (e, key, i, displayValue) => {
      e.preventDefault();
      e.stopPropagation();
      onClickItem(key, i);
      setIsOpen(false);
      if (!disableFocusing) {
        buttonRef.current.focus();
      }


      if (inputRef?.current) {
        inputRef.current.value = displayValue;
      }
    },
    [onClickItem, inputRef.current],
  );

  const getTranslation = (prefix, key) => {
    if (getTranslationLabel) {
      return t(getTranslationLabel(key));
    }

    return t(`${prefix}.${key}`, key);
  };

  const getTranslatedDisplayValue = (item) => ((tReady && item) ? getTranslation(translationPrefix, getDisplayValue(item)) : '');

  const getDropdownStyles = (item, maxheight) => {
    const dropdownItemStyles = getCustomItemStyle(item);
    if (maxheight) {
      dropdownItemStyles.lineHeight = `${height || DEFAULT_HEIGHT}px`;
    }
    return dropdownItemStyles;
  };

  const renderDropdownImages = () => images.map((image) => {
    const key = getKey(image);
    return (
      <DataElementWrapper
        key={key}
        type="button"
        dataElement={`dropdown-item-${key}`}
        className={classNames('Dropdown__item', { active: key === currentSelectionKey })}
        tabIndex={isOpen ? undefined : -1} // Just to be safe.
        onClick={(e) => onClickDropdownItem(e, key)}
      >
        <Icon glyph={image.src} className={image.className} />
      </DataElementWrapper>
    );
  });

  const renderDropdownItems = () => items
    .filter((item) => !isSearchEnabled || getTranslatedDisplayValue(item).toLowerCase().includes(inputVal.toLowerCase()))
    .map((item, i) => {
      const key = getKey(item);
      const translatedDisplayValue = getTranslatedDisplayValue(item);

      return (
        <DataElementWrapper
          key={key}
          type="button"
          dataElement={`dropdown-item-${key}`}
          className={classNames('Dropdown__item', { active: key === currentSelectionKey })}
          onClick={(e) => onClickDropdownItem(e, key, i, translatedDisplayValue)}
          tabIndex={isOpen ? undefined : -1} // Just to be safe.
          style={getDropdownStyles(item, maxHeight)}
        >
          {renderItem(item, getTranslatedDisplayValue)}
        </DataElementWrapper>
      );
    });

  let dropdownItems;
  let optionIsSelected;
  let selectedItem;
  let selectedItemDisplay;

  selectedItem = (hasImages ? images : items).find((item) => getKey(item) === currentSelectionKey);
  optionIsSelected = !!selectedItem;

  if (hasImages) {
    const glyph = selectedItem?.src || '';
    const className = selectedItem?.className || '';

    selectedItemDisplay = (
      <Icon glyph={glyph} className={className} />
    );
    dropdownItems = useMemo(renderDropdownImages, [images, currentSelectionKey]);
  } else if (!children) {
    if (optionIsSelected) {
      selectedItemDisplay = renderSelectedItem(selectedItem, getTranslatedDisplayValue);
    } else if (hasInput && currentSelectionKey) {
      optionIsSelected = !!currentSelectionKey;
      selectedItemDisplay = currentSelectionKey;
      selectedItem = currentSelectionKey;
    }

    dropdownItems = useMemo(renderDropdownItems, [
      currentSelectionKey,
      isOpen,
      items,
      onClickDropdownItem,
      inputVal,
      translationPrefix,
    ]);
  }

  const onOverlayKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' && isOpen) {
      // prevent overlay div scrolling when using arrow keys
      e.preventDefault();
    }
  };

  const buttonStyle = { width: `${width}px` };
  if (height) {
    buttonStyle.height = `${height}px`;
  }
  const scrollItemsStyle = { maxHeight: `${maxHeight}px` };

  const createDropdownButton = useCallback((value) => {
    if (isOpen && hasInput) {
      const onInputChange = (e) => {
        e.preventDefault();
        inputRef.current.value = e.target.value;
        setInputVal(e.target.value);
      };

      const onBlur = (e) => {
        // if the blur event is not caused by clicking on a dropdown item then clear the input
        const clickedOnDropdownItem = e.relatedTarget?.dataset?.element?.includes('dropdown-item');
        if (!clickedOnDropdownItem) {
          setInputVal('');
        }
      };

      const onKeyDown = (e) => {
        if (e.key === 'Enter' && isOpen && inputRef.current) {
          const newValue = inputRef.current.value;
          let itemToClick = newValue;

          if (!customDataValidator(newValue)) {
            itemToClick = value;
          }

          if (items.length > 0) {
            const result = items.find((item) => getTranslatedDisplayValue(item).toLowerCase() === newValue.toLowerCase());
            if (result) {
              itemToClick = result;
            }
          }

          onClickItem(itemToClick, -1);
          inputRef?.current?.blur();
          setIsOpen(false);
        }

        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' && isOpen) {
          // prevents scrolling when moving to overlay div using arrow keys
          e.preventDefault();
        }
      };

      return (
        <input
          className="Dropdown__input"
          onBlur={onBlur}
          onChange={onInputChange}
          ref={inputRef}
          onKeyDown={onKeyDown}
        />
      );
    }

    return value;
  }, [
    hasInput,
    inputRef,
    buttonRef,
    onClickItem,
    isOpen,
    selectedItem,
    customDataValidator
  ]);

  return (
    <DataElementWrapper className={`Dropdown__wrapper ${className} ${isOpen ? 'open' : ''}`} dataElement={dataElement}>
      {!displayButton &&
        <button
          className={classNames({
            'Dropdown': true,
            [className]: className,
          })}
          style={buttonStyle}
          onMouseDown={onToggle}
          onTouchEnd={onToggle}
          ref={buttonRef}
          disabled={disabled}
        >
          <div className="picked-option">
            <div
              className="picked-option-text"
              style={(optionIsSelected && applyCustomStyleToButton) ? getCustomItemStyle(selectedItem) : {}}
            >
              {createDropdownButton(optionIsSelected ? selectedItemDisplay : (placeholder || ''))}
            </div>
            <Icon className="arrow" glyph={`icon-chevron-${isOpen ? directionMap[arrowDirection] : arrowDirection}`} />
          </div>
        </button>
      }
      {displayButton &&
        <div ref={buttonRef} onClick={onToggle} className='display-button'>
          {displayButton(isOpen)}
        </div>
      }
      <div
        className={classNames('Dropdown__items', { 'hide': !isOpen, 'dropdown-items-with-custom-display': displayButton })}
        ref={overlayRef}
        role="listbox"
        aria-label={t(`${translationPrefix}.dropdownLabel`)}
        style={maxHeight ? scrollItemsStyle : undefined}
        onKeyDown={onOverlayKeyDown}
      >
        {children ? React.cloneElement(children, { onClose }) :
          dropdownItems.length > 0 ?
            (columns > 1 ?
              displayDropdownAsList(dropdownItems, columns) :
              dropdownItems
            ) :
            <>
              <button data-testid="sig-no-result" className="Dropdown__item">{t('message.noResults')}</button>
            </>
        }
      </div>
    </DataElementWrapper>
  );
}

const displayDropdownAsList = (items, columns) => {
  const table = [];
  let row = [];

  items.forEach((item, index) => {
    if (index % columns === 0 && row.length > 0) {
      table.push(
        <tr key={`row-${index}`}>
          {row}
        </tr>
      );
      row = [];
    }

    row.push(<td key={index} >{item}</td>);
  });

  if (row.length > 0) {
    table.push(
      <tr key={`row-${items.length + 1}`}>
        {row}
      </tr>
    );
  }

  return (
    <table>
      <tbody>
        {table}
      </tbody>
    </table>
  );
};

Dropdown.propTypes = propTypes;
export default Dropdown;
