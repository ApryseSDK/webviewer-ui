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
    ...rest
  } = props;


  const currentAlignment = useSelector(selector);
  const isActive = alignment === currentAlignment;

  const { dataElement, icon, title } = menuItems[buttonType];

  const handleClick = () => {
    setCellAlignment(alignment);
  };

  const commonProps = {
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
  style: PropTypes.object,
  className: PropTypes.string,
  alignment: PropTypes.string.isRequired,
  selector: PropTypes.func.isRequired,
  buttonType: PropTypes.string.isRequired,
};

export default BaseAlignmentButton;
