import classNames from 'classnames';
import Icon from 'components/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useArrowFocus from '../../hooks/useArrowFocus';
import './Dropdown.scss';

const propTypes = {
  onClickItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  currentSelectionKey: PropTypes.string.isRequired,
  translationPrefix: PropTypes.string.isRequired,
};

function Dropdown({ items, currentSelectionKey, translationPrefix, onClickItem }) {
  const [t] = useTranslation();

  const overlayRef = useRef(null);
  const buttonRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [itemsWidth, setItemsWidth] = useState(94);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (overlayRef.current && overlayRef.current.clientWidth !== items.itemsWidth) {
      setItemsWidth(overlayRef.current.clientWidth || 94);
    }
  });

  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen(prev => !prev), []);

  useArrowFocus(isOpen, onClose, overlayRef);

  const onClickOutside = useCallback(e => {
    if (buttonRef.current.contains(e.target)) {
      return;
    }
    setIsOpen(false);
  }, []);
  useOnClickOutside(overlayRef, onClickOutside);

  const onClickDropdownItem = (e, key) => {
    e.stopPropagation();

    onClickItem(key);
    setIsOpen(false);
    buttonRef.current.focus();
  };

  const renderDropdownItems = () => {
    return items.map(key => (
      <button
        key={key}
        className={classNames('Dropdown__item', { active: key === currentSelectionKey })}
        onClick={e => onClickDropdownItem(e, key)}
        tabIndex={isOpen ? undefined : -1} // Just to be safe.
      >
        {t(`${translationPrefix}.${key}`)}
      </button>
    ));
  };

  const optionIsSelected = items.some(key => key === currentSelectionKey);

  return (
    <div className="Dropdown__wrapper">
      <button
        className="Dropdown"
        style={{ width: `${itemsWidth + 2}px` }}
        data-element="dropdown"
        onClick={onToggle}
        ref={buttonRef}
      >
        <div className="picked-option">
          {optionIsSelected && (
            <div className="picked-option-text">{t(`${translationPrefix}.${currentSelectionKey}`)}</div>
          )}
          <Icon className="down-arrow" glyph="icon-chevron-down" />
        </div>
      </button>
      <div className={classNames('Dropdown__items', { 'hide': !isOpen })} ref={overlayRef}>
        {renderDropdownItems()}
      </div>
    </div>
  );
}

Dropdown.propTypes = propTypes;
export default Dropdown;
