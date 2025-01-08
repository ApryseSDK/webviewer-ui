import core from 'core';
import classNames from 'classnames';
import Icon from 'components/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';

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
  id: PropTypes.string.isRequired,
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
  onClosed: PropTypes.func,
  arrowDirection: PropTypes.string,
  disableFocusing: PropTypes.bool,
  renderItem: PropTypes.func,
  renderSelectedItem: PropTypes.func,
  labelledById: PropTypes.string,
  showLabelInList: PropTypes.bool,
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
  onFocus: PropTypes.func,
};

// Save a list of named combobox actions, for future readability
const SelectActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  PageDown: 6,
  PageUp: 7,
  Previous: 8,
  Select: 9,
  Type: 10,
  MoveCursor: 11,
  //Close and navigate is needed for dropdowns in headers, where the arrow left/right are used to navigate
  CloseAndNavigate: 12,
  FlyoutAction: 13,
};

function Dropdown({
  id = '',
  items,
  images,
  width = width || DEFAULT_WIDTH,
  height,
  columns = 1,
  currentSelectionKey,
  translationPrefix,
  getTranslationLabel,
  onClickItem = () => { },
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
  onOpened = () => { },
  onClosed = () => { },
  arrowDirection = 'down',
  children,
  disableFocusing = false,
  renderItem = (item, getTranslatedDisplayValue) => (<>{getTranslatedDisplayValue(item)}</>),
  renderSelectedItem = (item, getTranslatedDisplayValue) => (<>{getTranslatedDisplayValue(item)}</>),
  labelledById,
  showLabelInList = false,
  isFlyoutItem = false,
  onKeyDownHandler = null,
  onFocus = null,
}) {
  const { t, ready: tReady } = useTranslation();
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [displayKeys, setDisplayKeys] = useState([]);
  const [filteredItems, setFilteredItems] = useState(items);
  const [noMatchMessage, setNoMatchMessage] = useState('');
  // Create a ref that holds an array of refs for each option
  const optionRefs = useRef([]);

  useEffect(() => {
    // we ether have images or items, and need a list of keys to determine the active index
    let keys = [];
    if (images && images.length > 0) {
      keys = images.map((image) => image.key);
    } else if (items && items.length > 0) {
      keys = items.map((item) => getKey(item));
    }
    setDisplayKeys(keys);
    setActiveIndex(keys.findIndex((key) => key === currentSelectionKey));
    setFilteredItems(items);
  }, [currentSelectionKey, items, images]);


  useEffect(() => {
    // on open set the active index to the current selection key
    if (isOpen) {
      setActiveIndex(displayKeys.findIndex((key) => key === currentSelectionKey));
    }
  }, [isOpen]);

  const hasImages = images && images.length > 0;
  if (hasImages) {
    getKey = (item) => item.key;
  }

  const maintainScrollVisibility = (activeElement, scrollParent) => {
    const { offsetHeight, offsetTop } = activeElement;
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

    if (isAbove) {
      scrollParent.scrollTo(0, offsetTop);
    } else if (isBelow) {
      scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
  };

  const isScrollable = (element) => {
    return element && element.clientHeight < element.scrollHeight;
  };

  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback((e) => {
    if (hasInput && e.target === inputRef?.current) {
      return;
    }

    if (!disableFocusing) {
      buttonRef.current.focus();
    }

    e.preventDefault();

    if (disabled) {
      setIsOpen(false);
    } else {
      setIsOpen((prev) => !prev);
    }

    if (hasInput && !isOpen && !disableFocusing) {
      setTimeout(() => {
        inputRef?.current?.focus();
      });
    }

    // Keep the dropdown within the bounds of the viewer.
    const overlayBounds = overlayRef?.current?.getBoundingClientRect();
    const buttonBounds = buttonRef?.current?.getBoundingClientRect();
    let scrollBounds = overlayRef?.current?.closest('body')?.getBoundingClientRect();

    if (core?.getDocumentViewer()) {
      scrollBounds = core.getScrollViewElement().getBoundingClientRect();
    }

    // Only proceed with positioning if we have bounds and the dropdown is being opened.
    if (overlayBounds && !isOpen) {
      const offset = (arrowDirection === 'left' || arrowDirection === 'right') ? buttonBounds.height : 0;

      // Determine whether to open downward or upward based on available space
      const canOpenDownward = scrollBounds.bottom >= buttonBounds.bottom + overlayBounds.height;
      const canOpenUpward = scrollBounds.top <= buttonBounds.top - overlayBounds.height;

      // Adjust the top position of the dropdown based on available space
      if (canOpenDownward) {
        overlayRef.current.style.top = `${buttonBounds.height - offset}px`;
        overlayRef.current.style.maxHeight = maxHeight ? `${maxHeight}px` : '';
      } else if (canOpenUpward) {
        overlayRef.current.style.top = `-${overlayBounds.height - offset}px`;
        overlayRef.current.style.maxHeight = maxHeight ? `${maxHeight}px` : ''; // Use prop if available
      } else {
        // Default to downward with clipping and scrolling
        overlayRef.current.style.top = `${buttonBounds.height - offset}px`;
        // Set max height to either the prop value or the available space
        overlayRef.current.style.maxHeight = maxHeight
          ? `${maxHeight}px`
          : `${scrollBounds.bottom - buttonBounds.bottom}px`; // Fallback to available space
        overlayRef.current.style.overflowY = 'auto'; // Enable vertical scrolling
      }

      // Adjust horizontal positioning for left or right opening
      if (arrowDirection === 'left') {
        overlayRef.current.style.left = `-${buttonBounds.width}px`;
      } else if (arrowDirection === 'right') {
        overlayRef.current.style.left = `${buttonBounds.width}px`;
      }
    } else {
      // Reset top positioning and max height when closing
      overlayRef.current.style.top = '';
      overlayRef.current.style.maxHeight = maxHeight ? `${maxHeight}px` : '';
    }

    //Make sure the active element is visible
    if (isScrollable(overlayRef.current)) {
      const activeElement = optionRefs.current[activeIndex];
      // in situations where the active element is not in the dropdown, for instance with a font size not
      // in the predefined list, we do nothing
      if (activeElement) {
        maintainScrollVisibility(activeElement, overlayRef.current);
      }
    }
  }, [hasInput, isOpen, disabled, activeIndex]);

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
      onClosed();
    } else {
      onOpened();
    }

    if (isOpen && hasInput && inputRef?.current) {
      inputRef.current.value = currentSelectionKey;
      // Focus causes issues with quill so we added this prop to disable focusing
      if (!disableFocusing) {
        inputRef.current.select();
      }
    }
  }, [isOpen, inputRef.current, currentSelectionKey, hasInput]);

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

  const renderDropdownImages = () => images.map((image, i) => {
    const key = getKey(image);
    return (
      <DataElementWrapper
        key={key}
        id={`${id}-${key}`}
        role="option"
        aria-label={key}
        aria-selected={key === currentSelectionKey}
        dataElement={`dropdown-item-${key}`}
        ref={(el) => optionRefs.current[i] = el}
        className={classNames('Dropdown__item', { selected: key === currentSelectionKey, active: i === activeIndex })}
        tabIndex={isOpen ? undefined : -1} // Just to be safe.
        onClick={(e) => onClickDropdownItem(e, key)}
      >
        <Icon glyph={image.src} className={image.className} />
      </DataElementWrapper>
    );
  });

  useEffect(() => {
    if (isSearchEnabled) {
      setFilteredItems(items.filter((key) => getTranslatedDisplayValue(key).toLowerCase().includes(inputVal.toLowerCase())));
    }

  }, [inputVal, isSearchEnabled, displayKeys, items]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      setNoMatchMessage(t('message.noResults'));
    } else {
      setNoMatchMessage('');
    }
  }, [filteredItems]);


  useEffect(() => {
    if (isSearchEnabled) {
      setActiveIndex(0);
    } else {
      const index = displayKeys.findIndex((key) => key === inputVal);
      setActiveIndex(index);
    }
  }, [inputVal, isSearchEnabled]);


  // on close we need to set the active index to the current selection key
  // so it can open at the correct index
  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(displayKeys.findIndex((key) => key === currentSelectionKey));
    }
  }, [isOpen, displayKeys, currentSelectionKey]);

  const renderDropdownItems = () => filteredItems
    .map((item, i) => {
      const key = getKey(item);
      const translatedDisplayValue = getTranslatedDisplayValue(item);

      // This is a corner case for the text signatures
      // because the font family is not displayed in the dropdown, but the signature is.
      const isFont = !!item.font;

      return (
        <DataElementWrapper
          key={key}
          role="option"
          aria-label={isFont ? item.font : null}
          id={`${id}-${key}`}
          aria-selected={key === currentSelectionKey}
          dataElement={`dropdown-item-${key}`}
          className={classNames('Dropdown__item', { selected: key === currentSelectionKey, active: i === activeIndex })}
          onClick={(e) => onClickDropdownItem(e, key, i, translatedDisplayValue)}
          tabIndex={isOpen ? 0 : -1}
          ref={(el) => optionRefs.current[i] = el}
          style={getDropdownStyles(item, maxHeight)}
        >
          {renderItem(item, getTranslatedDisplayValue)}
        </DataElementWrapper>
      );
    });

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
  } else if (!children) {
    if (optionIsSelected) {
      selectedItemDisplay = renderSelectedItem(selectedItem, getTranslatedDisplayValue);
    } else if (hasInput && currentSelectionKey) {
      optionIsSelected = !!currentSelectionKey;
      selectedItemDisplay = currentSelectionKey;
      selectedItem = currentSelectionKey;
    }
  }

  const dropdownItems = useMemo(() => {
    if (hasImages) {
      return renderDropdownImages();
    } else if (!children) {
      return renderDropdownItems();
    }
  }, [
    currentSelectionKey,
    isOpen,
    items,
    onClickDropdownItem,
    inputVal,
    translationPrefix,
    activeIndex,
    images,
    filteredItems,
    renderItem,
  ]);


  // Make it so the combo and listbox have the same widths
  const comboBoxStyle = { width: `${width}px` };
  if (height) {
    comboBoxStyle.height = `${height}px`;
  }

  const listBoxStyle = {};
  if (maxHeight) {
    listBoxStyle.maxHeight = `${maxHeight}px`;
  }
  if (width) {
    listBoxStyle.width = `${width}px`;
  }

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
      };

      return (
        <input
          className="Dropdown__input"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${id}-dropdown`}
          onBlur={onBlur}
          onChange={onInputChange}
          ref={inputRef}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          aria-activedescendant={isOpen ? `${id}-${filteredItems[activeIndex]}` : null}
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
    customDataValidator,
    id,
    displayKeys,
    activeIndex,
    filteredItems,
  ]);



  const getActionFromKey = (event, isOpen, hasInput) => {
    const { key, altKey, ctrlKey, metaKey } = event;
    const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
    // handle flyout onKeyDownHandler precedence over default dropdown behavior
    if (onKeyDownHandler) {
      const isFlyoutItemVerticalNavigation = isFlyoutItem && !isOpen && ['ArrowDown', 'ArrowUp'].includes(key);
      const isFlyoutItemCloseCondition = isFlyoutItem && ['Escape', 'Tab'].includes(key);
      if (isFlyoutItemVerticalNavigation || isFlyoutItemCloseCondition) {
        return SelectActions.FlyoutAction;
      }
    }

    // handle opening when closed
    if (!isOpen && openKeys.includes(key)) {
      return SelectActions.Open;
    }

    // home and end move the selected option when open or closed
    if (key === 'Home') {
      return SelectActions.First;
    }
    if (key === 'End') {
      return SelectActions.Last;
    }

    // handle typing characters when open or closed
    if (
      key === 'Backspace' ||
      key === 'Clear' ||
      (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
    ) {
      return SelectActions.Type;
    }

    // handle keys when open
    if (isOpen) {
      if (key === 'ArrowUp' && altKey) {
        return SelectActions.CloseSelect;
      } else if (key === 'ArrowDown' && !altKey) {
        return SelectActions.Next;
      } else if (key === 'ArrowUp') {
        return SelectActions.Previous;
      } else if (key === 'PageUp') {
        return SelectActions.PageUp;
      } else if (key === 'PageDown') {
        return SelectActions.PageDown;
      } else if (key === 'Escape') {
        return SelectActions.Close;
      } else if (key === 'Enter' || key === ' ' || key === 'Tab') {
        return SelectActions.CloseSelect;
      } else if (key === 'ArrowRight' || key === 'ArrowLeft') {
        if (hasInput) {
          return SelectActions.MoveCursor;
        } else {
          return SelectActions.CloseAndNavigate;
        }
      }
    }
  };

  const onOptionChange = (action) => {
    let newIndex = activeIndex;

    if (action === SelectActions.Next) {
      // if we have a filter then displayKeys will be different than filteredItems
      const maxIndex = Math.max(displayKeys.length - 1, filteredItems.length - 1);
      if (activeIndex < maxIndex) {
        newIndex = activeIndex + 1;
      }
    } else if (action === SelectActions.Previous) {
      newIndex = Math.max(0, activeIndex - 1);
    }

    setActiveIndex(newIndex);

    if (isScrollable(overlayRef.current)) {
      const activeElement = optionRefs.current[newIndex];
      maintainScrollVisibility(activeElement, overlayRef.current);
    }
  };

  const selectOption = () => {
    // if we have a filter in place then the value is from a different array
    let key;
    if (displayKeys.length !== filteredItems.length && images.length === 0) {
      key = filteredItems[activeIndex];
    } else {
      key = displayKeys[activeIndex];
    }
    if (!key) {
      // if we have an input and the key is not in the dropdown, we need to use the input value
      key = inputVal;
    }
    onClickItem(key, activeIndex);
    setIsOpen(false);
  };

  const onComboBoxKeyDown = (event) => {
    const action = getActionFromKey(event, isOpen, hasInput);
    switch (action) {
      case SelectActions.FlyoutAction:
        return onKeyDownHandler(event);
      case SelectActions.Next:
      case SelectActions.Previous:
        event.preventDefault();
        event.stopPropagation();
        return onOptionChange(action);
      case SelectActions.Open:
        event.preventDefault();
        event.stopPropagation();
        return onToggle(event);
      case SelectActions.CloseSelect:
        event.preventDefault();
        event.stopPropagation();
        return selectOption();
      case SelectActions.Close:
        event.preventDefault();
        event.stopPropagation();
        return setIsOpen(false);
      case SelectActions.MoveCursor:
        event.stopPropagation();
        return;
      case SelectActions.CloseAndNavigate:
        return setIsOpen(false);
    }
  };

  // If we are showing the label in the list, we just use that as our labelled by id
  labelledById = showLabelInList ? `${id}-dropdown-label` : labelledById;
  let activeDescendantId = 'id-no-result';
  if (activeIndex >= 0) {
    if (images.length > 0 && images[activeIndex]) {
      activeDescendantId = `${id}-${getKey(images[activeIndex])}`;
    } else if (filteredItems.length > 0 && filteredItems[activeIndex]) {
      activeDescendantId = `${id}-${getKey(filteredItems[activeIndex])}`;
    }
  }

  return (
    <DataElementWrapper id={id} className={`Dropdown__wrapper ${className} ${isOpen ? 'open' : ''}`} dataElement={dataElement} disabled={disabled}>
      {!displayButton &&
        <div
          className={classNames({
            'Dropdown': true,
            [className]: className,
            'disabled': disabled,
          })}
          role='combobox'
          aria-haspopup="listbox"
          aria-describedby={images.length > 0 ? activeDescendantId : null}
          aria-expanded={isOpen}
          aria-activedescendant={isOpen ? activeDescendantId : null}
          aria-labelledby={labelledById}
          aria-controls={`${id}-dropdown`}
          style={comboBoxStyle}
          onMouseDown={onToggle}
          onTouchEnd={onToggle}
          onKeyDown={onComboBoxKeyDown}
          ref={buttonRef}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <div className="picked-option">
            <div
              className="picked-option-text"
              style={(optionIsSelected && applyCustomStyleToButton) ? getCustomItemStyle(selectedItem) : {}}
            >
              {createDropdownButton(optionIsSelected ? selectedItemDisplay : (placeholder || ''))}
            </div>
            <Icon className="arrow" disabled={disabled} glyph={`icon-chevron-${isOpen ? directionMap[arrowDirection] : arrowDirection}`} ariaHidden />
          </div>
        </div>
      }
      {displayButton &&
        <div ref={buttonRef} onClick={onToggle} className='display-button'>
          {displayButton(isOpen)}
        </div>
      }
      <div
        className={classNames('Dropdown__items', { 'hide': !isOpen, 'dropdown-items-with-custom-display': displayButton, 'dropdown-items-with-label': showLabelInList })}
        ref={overlayRef}
        role="listbox"
        id={`${id}-dropdown`}
        style={listBoxStyle}
      >
        <div role="group" aria-labelledby={labelledById}>
          {showLabelInList && <div className="Dropdown__label" id={labelledById}>{t(`${translationPrefix}.dropdownLabel`)}</div>}
          {children ? React.cloneElement(children, { onClose }) :
            dropdownItems.length > 0 ?
              (columns > 1 ?
                displayDropdownAsList(dropdownItems, columns) :
                dropdownItems
              ) :
              <>
                <div
                  role="option"
                  id='id-no-result'
                  aria-disabled="true"
                  aria-selected="true"
                  className={classNames('Dropdown__item', 'selected', 'active')}
                  data-testid="sig-no-result"
                >
                  {t('message.noResults')}
                </div>
              </>
          }
        </div>
      </div>
      <div aria-live="polite" style={{ position: 'absolute', left: '-9999px' }}>
        {noMatchMessage}
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
Dropdown.defaultProps = {
  items: [],
  images: [],
};
export default Dropdown;
