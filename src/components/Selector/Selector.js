import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import useOnClickOutside from 'hooks/useOnClickOutside';
import Icon from 'components/Icon';
import './Selector.scss';

const propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedItem: PropTypes.string,
  onItemSelected: PropTypes.func.isRequired,
  placeHolder: PropTypes.string,
  selectedItemStyle: PropTypes.object,
};

const Selector = ({ className, items = [], selectedItem = '', onItemSelected, placeHolder, selectedItemStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  const selectorRef = useRef(null);

  useOnClickOutside(selectorRef, () => {
    setIsOpen(false);
  });

  return (
    <div
      ref={selectorRef}
      className={classNames({
        customSelector: true,
        [className]: !!className,
      })}
    >
      <button className="customSelector__selectedItem" style={selectedItemStyle} onClick={toggleDropdown}>
        {!selectedItem && placeHolder ? placeHolder : selectedItem}
        <Icon className="down-arrow" glyph={'icon-chevron-down'} />
      </button>
      <ul className={classNames({
        open: isOpen,
      })}>
        <li>
          <button className="customSelector__selectedItem" onClick={toggleDropdown}>
            <div style={selectedItemStyle}>{!selectedItem && placeHolder ? placeHolder : selectedItem}</div>
            <Icon className="up-arrow" glyph={'icon-chevron-up'} />
          </button>
        </li>
        {items.map((value, i) => (
          <li key={value + i}>
            <button
              className={classNames({
                options: true,
                optionSelected: selectedItem === value,
              })}
              onClick={() => {
                setIsOpen(false);
                onItemSelected(value);
              }}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

Selector.propTypes = propTypes;

export default Selector;
