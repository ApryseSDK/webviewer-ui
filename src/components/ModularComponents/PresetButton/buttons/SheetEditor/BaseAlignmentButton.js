import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import ActionButton from 'components/ActionButton';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import setCellAlignment from 'src/helpers/setCellAlignment';
import PropTypes from 'prop-types';

const BaseAlignmentButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    style,
    className,
    alignment,
    selector,
    buttonType,
    dataElement = menuItems[buttonType].dataElement,
    img: icon = menuItems[buttonType].icon,
    title = menuItems[buttonType].title,
    ...rest
  } = props;

  const currentAlignment = useSelector(selector);
  const isActive = alignment === currentAlignment;

  const handleClick = () => {
    setCellAlignment(alignment);
  };

  const commonProps = {
    dataElement,
    ...rest,
    ref,
    onClick: handleClick,
  };

  return isFlyoutItem ? (
    <FlyoutItemContainer {...commonProps} additionalClass={isActive ? 'active' : ''} />
  ) : (
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
  );
});

BaseAlignmentButton.displayName = 'BaseAlignmentButton';

BaseAlignmentButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  alignment: PropTypes.string.isRequired,
  selector: PropTypes.func.isRequired,
  buttonType: PropTypes.string.isRequired,
  img: PropTypes.string,
  title: PropTypes.string,
};

export default BaseAlignmentButton;
