import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import { STYLE_TOGGLE_OPTIONS } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import setCellFontStyle from 'src/helpers/setCellFontStyle';

const propTypes = {
  styleType: PropTypes.oneOf(Object.values(STYLE_TOGGLE_OPTIONS)).isRequired,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

const CellDecoratorButton = forwardRef((props, ref) => {
  const { isFlyoutItem, styleType, style, className } = props;
  const currentFontStyle = useSelector((state) => selectors.getActiveCellRangeFontStyle(state, styleType));
  const isActive = currentFontStyle;
  const { dataElement, icon, title } = menuItems[`${styleType}Button`];

  const handleClick = () => {
    setCellFontStyle({ [styleType]: !isActive });
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