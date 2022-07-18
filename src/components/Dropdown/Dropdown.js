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
  onClickItem: PropTypes.func,
  items: PropTypes.array,
  images: PropTypes.array,
  width: PropTypes.number,
  currentSelectionKey: PropTypes.string,
  translationPrefix: PropTypes.string,
  getTranslationLabel: PropTypes.func,
  dataElement: PropTypes.string,
  disabled: PropTypes.bool,
  isFont: PropTypes.bool,
  placeholder: PropTypes.string,
  maxHeight: PropTypes.number,
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
  isFont = false,
  placeholder = null,
  maxHeight,
}) {
  const { t, ready: tReady } = useTranslation();
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen(prev => !prev), []);

  // Close dropdown if WebViewer loses focus (ie, user clicks outside iframe).
  useEffect(() => {
    window.addEventListener('blur', () => {
      setIsOpen(false);
    });
  }, []);

  useArrowFocus(isOpen, onClose, overlayRef);

  const onClickOutside = useCallback(e => {
    if (!buttonRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);
  useOnClickOutside(overlayRef, onClickOutside);

  const onClickDropdownItem = useCallback(
    (e, key) => {
      e.stopPropagation();
      onClickItem(key);
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

  const getDropdownStyles = (isFont, key, maxheight) => {
    if (isFont && key && maxheight) {
      return { fontFamily: key, lineHeight: `28px` };
    } else if (isFont && key) {
      return { fontFamily: key };
    } else if (maxheight) {
      return { lineHeight: `28px` };
    }
  };

  const renderDropdownImages = () =>
    images.map(image => (
      <DataElementWrapper
        key={image.key}
        type="button"
        dataElement={`dropdown-item-${image.key}`}
        className={classNames('Dropdown__item', { active: image.key === currentSelectionKey })}
        tabIndex={isOpen ? undefined : -1} // Just to be safe.
        onClick={e => onClickDropdownItem(e, image.key)}
      >
        <Icon glyph={image.src} className={image.className} />
      </DataElementWrapper>
    ));

  const renderDropdownItems = () =>
    items.map(key => (
      <DataElementWrapper
        key={key}
        type="button"
        dataElement={`dropdown-item-${key}`}
        className={classNames('Dropdown__item', { active: key === currentSelectionKey })}
        onClick={e => onClickDropdownItem(e, key)}
        tabIndex={isOpen ? undefined : -1} // Just to be safe.
        style={getDropdownStyles(isFont, key, maxHeight)}
      >
        {getTranslation(translationPrefix, key)}
      </DataElementWrapper>
    ));

  let dropdownItems;
  let optionIsSelected;
  let selectedItem;

  const hasImages = images && images.length > 0;
  if (hasImages) {
    const imageKeys = images.map(item => item.key);
    const selectedImageIndex = getImageIndexFromKey(images, currentSelectionKey);

    optionIsSelected = imageKeys.some(key => key === currentSelectionKey);
    selectedItem = <Icon glyph={images[selectedImageIndex].src} className={images[selectedImageIndex].className} />;
    dropdownItems = useMemo(renderDropdownImages, [images, currentSelectionKey]);
  } else {
    optionIsSelected = items.some(key => key === currentSelectionKey);
    selectedItem = tReady ? getTranslation(translationPrefix, currentSelectionKey) : '';

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
    <DataElementWrapper className="Dropdown__wrapper" dataElement={dataElement}>
      <button className="Dropdown" style={buttonStyle} onClick={onToggle} ref={buttonRef} disabled={disabled}>
        <div className="picked-option">
          {optionIsSelected && (
            <div className="picked-option-text" style={isFont ? { fontFamily: currentSelectionKey } : undefined}>
              {selectedItem}
            </div>
          )}
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
