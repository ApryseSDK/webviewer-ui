import classNames from 'classnames';
import Icon from 'components/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import useArrowFocus from '../../hooks/useArrowFocus';
import './Dropdown.scss';

const DEFAULT_WIDTH = 98;

const propTypes = {
  onClickItem: PropTypes.func,
  items: PropTypes.array.isRequired,
  currentSelectionKey: PropTypes.string,
  translationPrefix: PropTypes.string,
  getTranslationLabel: PropTypes.func,
  dataElement: PropTypes.string,
  disabled: PropTypes.bool,
  isFont: PropTypes.bool,
  placeholder: PropTypes.string,
};

function Dropdown({
  items = [],
  currentSelectionKey,
  translationPrefix,
  getTranslationLabel,
  onClickItem,
  dataElement,
  disabled=false,
  isFont =false,
  placeholder = null,
}) {
  const  { t, ready: tReady } = useTranslation();
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
    if(getTranslationLabel) {
      return t(getTranslationLabel(key));
    }
    
    return t(`${prefix}.${key}`, key)
  }

  const dropdownItems = useMemo(
    () =>
      items.map(key => (
        <DataElementWrapper
          key={key}
          type="button"
          dataElement={`dropdown-item-${key}`}
          className={classNames('Dropdown__item', { active: key === currentSelectionKey })}
          onClick={e => onClickDropdownItem(e, key)}
          tabIndex={isOpen ? undefined : -1} // Just to be safe.
          style={isFont ? { fontFamily: key } : undefined}
        >
          {getTranslation(translationPrefix, key)}
        </DataElementWrapper>
      )),
    [currentSelectionKey, isOpen, items, onClickDropdownItem, t, translationPrefix],
  );

  const optionIsSelected = items.some(key => key === currentSelectionKey);
  const buttonStyle = { width: `${DEFAULT_WIDTH + 2}px` };


  return (
    <DataElementWrapper
      className="Dropdown__wrapper"
      dataElement={dataElement}
    >
      <button
        className="Dropdown"
        style={buttonStyle}
        onClick={onToggle}
        ref={buttonRef}
        disabled={disabled}
      >
        <div className="picked-option">
          {optionIsSelected && (
            <div className="picked-option-text" style={isFont ? { fontFamily: currentSelectionKey } : undefined}>
              {tReady? getTranslation(translationPrefix, currentSelectionKey) : ''}
            </div>
          )}
          {!optionIsSelected && placeholder && (
            <div className="picked-option-text">{placeholder}</div>
          )}
          <Icon className="down-arrow" glyph="icon-chevron-down" />
        </div>
      </button>
      <div
        className={classNames('Dropdown__items', { 'hide': !isOpen })}
        ref={overlayRef}
        role="listbox"
        aria-label={t(`${translationPrefix}.dropdownLabel`)}
      >
        {dropdownItems}
      </div>
    </DataElementWrapper>
  );
}

Dropdown.propTypes = propTypes;
export default Dropdown;
