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

const propTypes = {
  items: PropTypes.array,
  images: PropTypes.array,
  width: PropTypes.number,
  currentSelectionKey: PropTypes.string,
  translationPrefix: PropTypes.string,
  getTranslationLabel: PropTypes.func,
  onClickItem: PropTypes.func,
  dataElement: PropTypes.string,
  disabled: PropTypes.bool,
  getCustomItemStyle: PropTypes.func,
  placeholder: PropTypes.string,
  maxHeight: PropTypes.number,
  getKey: PropTypes.func,
  getDisplayValue: PropTypes.func,
  className: PropTypes.string
};

function Dropdown({
  items = [],
  images = [],
  width = DEFAULT_WIDTH,
  currentSelectionKey,
  translationPrefix,
  getTranslationLabel,
  onClickItem,
  dataElement,
  disabled = false,
  // eslint-disable-next-line no-unused-vars
  getCustomItemStyle = (item) => ({}),
  placeholder = null,
  maxHeight,
  getKey = (item) => item,
  getDisplayValue = (item) => item,
  className = ''
}) {
  const { t, ready: tReady } = useTranslation();
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback((e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  }, []);

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

  useArrowFocus(isOpen, onClose, overlayRef);

  const onClickOutside = useCallback((e) => {
    if (!buttonRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);
  useOnClickOutside(overlayRef, onClickOutside);

  const onClickDropdownItem = useCallback(
    (e, key, i) => {
      e.preventDefault();
      e.stopPropagation();
      onClickItem(key, i);
      setIsOpen(false);
      buttonRef.current.focus();
    },
    [onClickItem],
  );

  const getTranslation = (prefix, key) => {
    if (getTranslationLabel) {
      return t(getTranslationLabel(key));
    }

    return t(`${prefix}.${key}`, key);
  };

  const getDropdownStyles = (item, maxheight) => {
    const dropdownItemStyles = getCustomItemStyle(item);
    if (maxheight) {
      dropdownItemStyles.lineHeight = '28px';
    }
    return dropdownItemStyles;
  };

  const renderDropdownImages = () => images.map((image) => (
    <DataElementWrapper
      key={image.key}
      type="button"
      dataElement={`dropdown-item-${image.key}`}
      className={classNames('Dropdown__item', { active: image.key === currentSelectionKey })}
      tabIndex={isOpen ? undefined : -1} // Just to be safe.
      onClick={(e) => onClickDropdownItem(e, image.key)}
    >
      <Icon glyph={image.src} className={image.className} />
    </DataElementWrapper>
  ));

  const renderDropdownItems = () => items.map((item, i) => {
    const key = getKey(item);
    return (
      <DataElementWrapper
        key={key}
        type="button"
        dataElement={`dropdown-item-${key}`}
        className={classNames('Dropdown__item', { active: key === currentSelectionKey })}
        onClick={(e) => onClickDropdownItem(e, key, i)}
        tabIndex={isOpen ? undefined : -1} // Just to be safe.
        style={getDropdownStyles(item, maxHeight)}
      >
        {getTranslation(translationPrefix, getDisplayValue(item))}
      </DataElementWrapper>
    );
  });

  let dropdownItems;
  let optionIsSelected;
  let selectedItem;
  let selectedItemDisplay;

  const hasImages = images && images.length > 0;
  if (hasImages) {
    const imageKeys = images.map((item) => item.key);
    const selectedImageIndex = getImageIndexFromKey(images, currentSelectionKey);
    optionIsSelected = imageKeys.some((key) => key === currentSelectionKey);

    let glyph = '';
    let className = '';
    if (selectedImageIndex > -1) {
      glyph = images[selectedImageIndex].src;
      className = images[selectedImageIndex].className;
    }

    selectedItemDisplay = (
      <Icon glyph={glyph} className={className} />
    );
    dropdownItems = useMemo(renderDropdownImages, [images, currentSelectionKey]);
  } else {
    optionIsSelected = items.some((item) => getKey(item) === currentSelectionKey);
    if (optionIsSelected) {
      selectedItem = items.find((item) => getKey(item) === currentSelectionKey);
      selectedItemDisplay = tReady ? getTranslation(translationPrefix, getDisplayValue(selectedItem)) : '';
    }

    dropdownItems = useMemo(renderDropdownItems, [
      currentSelectionKey,
      isOpen,
      items,
      onClickDropdownItem,
      t,
      translationPrefix,
    ]);
  }

  const buttonStyle = { width: `${width}px` };
  const scrollItemsStyle = { maxHeight: `${maxHeight}px` };

  return (
    <DataElementWrapper className={`Dropdown__wrapper ${className}`} dataElement={dataElement}>
      <button className="Dropdown" style={buttonStyle} onClick={onToggle} ref={buttonRef} disabled={disabled}>
        <div className="picked-option">
          {optionIsSelected && (
            <div className="picked-option-text" style={getCustomItemStyle(selectedItem)}>
              {selectedItemDisplay}
            </div>
          )}
          {!optionIsSelected && !placeholder && (<div className="picked-option-text" ></div>)}
          {!optionIsSelected && placeholder && <div className="picked-option-text">{placeholder}</div>}
          <Icon className="arrow" glyph={`icon-chevron-${isOpen ? 'up' : 'down'}`} />
        </div>
      </button>
      <div
        className={classNames('Dropdown__items', { 'hide': !isOpen })}
        ref={overlayRef}
        role="listbox"
        aria-label={t(`${translationPrefix}.dropdownLabel`)}
        style={maxHeight ? scrollItemsStyle : undefined}
      >
        {dropdownItems}
      </div>
    </DataElementWrapper>
  );
}

const getImageIndexFromKey = (imageArray, key) => {
  if (!imageArray || imageArray.length === 0) {
    return -1;
  }

  let imageIndex = -1;
  imageArray.forEach((image, index) => {
    if (image.key === key) {
      imageIndex = index;
    }
  });

  return imageIndex;
};

Dropdown.propTypes = propTypes;
export default Dropdown;
