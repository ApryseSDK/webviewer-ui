import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import useCore from 'hooks/useCore';
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
  const { core } = useCore();
  const { isFlyoutItem, styleType, style, className } = props;
  const menuItem = menuItems[`${styleType}Button`];
  const {
    dataElement = menuItem.dataElement,
    img: icon = menuItem.icon,
    title = menuItem.title,
  } = props;
  let convertedStyleType;
  switch (styleType) {
    case 'strikeout':
      convertedStyleType = 'strikethrough';
      break;
    default:
      convertedStyleType = styleType;
  }
  const isActive = useSelector((state) => selectors.isStyleButtonActive(state, convertedStyleType));

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