import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import setCellTextWrap from 'src/helpers/setCellTextWrap';

const propTypes = {
  type: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  buttonType: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
  wrapText: PropTypes.string,
};

const CellTextWrapButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    type,
    style,
    className,
    buttonType,
    wrapText,
    dataElement = menuItems[buttonType].dataElement,
    img: icon = menuItems[buttonType].icon,
    title = menuItems[buttonType].title,
  } = props;
  const currentWrapText = useSelector((state) => selectors.getActiveCellRangeWrapText(state));
  const isActive = wrapText === currentWrapText;

  const handleClick = () => {
    setCellTextWrap(wrapText);
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

CellTextWrapButton.propTypes = propTypes;
CellTextWrapButton.displayName = 'CellTextWrapButton';

export default CellTextWrapButton;
