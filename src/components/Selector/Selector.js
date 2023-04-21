import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
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
  return (
    <div className={classNames({
      customSelector: true,
      [className]: !!className,
    })}>
      <button className="customSelector__selectedItem" style={selectedItemStyle}>
        {!selectedItem && placeHolder ? placeHolder : selectedItem}
        <Icon className="down-arrow" glyph={'icon-chevron-down'} />
      </button>
      <ul>
        <li>
          <div style={selectedItemStyle}>{!selectedItem && placeHolder ? placeHolder : selectedItem}</div>
          <Icon className="up-arrow" glyph={'icon-chevron-up'} />
        </li>
        {items.map((value, i) => (
          <li key={value + i}>
            <button
              className={classNames({
                options: true,
                optionSelected: selectedItem === value,
              })}
              onMouseDown={() => onItemSelected(value)}
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
