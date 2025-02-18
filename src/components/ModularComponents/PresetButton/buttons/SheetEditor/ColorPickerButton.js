import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import { CELL_COLOR_OPTIONS } from 'src/constants/spreadsheetEditor';

const propTypes = {
  type: PropTypes.oneOf(Object.values(CELL_COLOR_OPTIONS)).isRequired,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

const ColorPickerButton = forwardRef((props, ref) => {
  const { isFlyoutItem, type, style, className } = props;
  const isActive = false;

  const key = `cell${type.charAt(0).toUpperCase()}${type.slice(1)}`;
  const { dataElement, icon, title } = menuItems[key];

  const handleClick = () => {
    // handle button click
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={handleClick}
        additionalClass={isActive ? 'active' : ''}
      />
      : (
        <ActionButton
          key={type}
          isActive={isActive}
          onClick={handleClick}
          dataElement={dataElement}
          title={title}
          img={icon}
          ariaPressed={isActive}
          style={style}
          className={className}
        />
      )
  );
});

ColorPickerButton.propTypes = propTypes;
ColorPickerButton.displayName = 'ColorPickerButton';

export default ColorPickerButton;