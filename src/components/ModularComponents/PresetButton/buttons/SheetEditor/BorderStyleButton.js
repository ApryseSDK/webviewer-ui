import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  borderStyle: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

const BorderStyleButton = forwardRef((props, ref) => {
  const { isFlyoutItem, borderStyle, style, className } = props;
  const isActive = false;

  const { dataElement, icon, title } = menuItems['cellBorderStyle'];

  const handleClick = () => {
    // handle click
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
          key={borderStyle}
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

BorderStyleButton.propTypes = propTypes;
BorderStyleButton.displayName = 'BorderStyleButton';

export default BorderStyleButton;