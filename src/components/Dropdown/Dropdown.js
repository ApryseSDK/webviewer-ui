import classNames from 'classnames';
import Icon from 'components/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import useArrowFocus from '../../hooks/useArrowFocus';
import './Dropdown.scss';

const DEFAULT_WIDTH = 94;

const propTypes = {
  onClickItem: PropTypes.func,
  items: PropTypes.array.isRequired,
  currentSelectionKey: PropTypes.string,
  translationPrefix: PropTypes.string,
  dataElement: PropTypes.string,
};

function Dropdown({ items = [], currentSelectionKey, translationPrefix, onClickItem, dataElement, disabled=false }) {
  const  { t, ready: tReady } = useTranslation();
  const overlayRef = useRef(null);
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [itemsWidth] = useState(DEFAULT_WIDTH);

  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen(prev => !prev), []);

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
        >
          {t(`${translationPrefix}.${key}`, key)}
        </DataElementWrapper>
      )),
    [currentSelectionKey, isOpen, items, onClickDropdownItem, t, translationPrefix],
  );

  const optionIsSelected = items.some(key => key === currentSelectionKey);

  const buttonStyle = useMemo(
    () => ({ width: `${(itemsWidth || DEFAULT_WIDTH) + 2}px` }),
    [itemsWidth],
  );

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
            <div className="picked-option-text">
              {tReady? t(`${translationPrefix}.${currentSelectionKey}`, currentSelectionKey) : ''}
            </div>
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
