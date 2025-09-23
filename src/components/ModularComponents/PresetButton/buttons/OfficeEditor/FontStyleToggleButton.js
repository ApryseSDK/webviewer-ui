import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import core from 'core';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import { STYLE_TOGGLE_OPTIONS } from 'src/constants/customizationVariables';

const propTypes = {
  styleType: PropTypes.oneOf(Object.values(STYLE_TOGGLE_OPTIONS)).isRequired,
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};

const FontStyleToggleButton = forwardRef((props, ref) => {
  const { isFlyoutItem, styleType, style, className } = props;
  const menuItem = menuItems[`${styleType}Button`];
  const {
    dataElement = menuItem.dataElement,
    img: icon = menuItem.icon,
    title = menuItem.title,
  } = props;
  const isActive = useSelector((state) => selectors.isStyleButtonActive(state, styleType));

  const handleClick = () => {
    core.getOfficeEditor().updateSelectionAndCursorStyle({ [styleType]: true });
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
          key={styleType}
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

FontStyleToggleButton.propTypes = propTypes;
FontStyleToggleButton.displayName = 'FontStyleToggleButton';

export default FontStyleToggleButton;