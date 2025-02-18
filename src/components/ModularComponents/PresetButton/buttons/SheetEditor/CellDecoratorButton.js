import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import { STYLE_TOGGLE_OPTIONS } from 'constants/officeEditor';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  styleType: PropTypes.oneOf(Object.values(STYLE_TOGGLE_OPTIONS)).isRequired,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

const CellDecoratorButton = forwardRef((props, ref) => {
  const { isFlyoutItem, styleType, style, className } = props;
  const isActive = false;

  const lowerCaseStyleType = styleType.charAt(0).toLowerCase() + styleType.slice(1);
  const { dataElement, icon, title } = menuItems[`${lowerCaseStyleType}Button`];

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
          ariaCurrent={isActive}
          isActive={isActive}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          style={style}
          className={className}
        />
      )
  );
});

CellDecoratorButton.propTypes = propTypes;
CellDecoratorButton.displayName = 'CellDecoratorButton';

export default CellDecoratorButton;