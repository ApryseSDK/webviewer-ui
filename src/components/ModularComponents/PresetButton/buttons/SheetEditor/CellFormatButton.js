import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import setCellFormatString from '../../../../../helpers/setCellFormatString';

const propTypes = {
  formatType: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  secondaryLabel: PropTypes.string,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  selector: PropTypes.func,
  img: PropTypes.string,
  title: PropTypes.string,
};

const CellFormatButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    formatType,
    secondaryLabel,
    style,
    className,
    dataElement = menuItems[formatType].dataElement,
    img: icon = menuItems[formatType].icon,
    title = menuItems[formatType].title,
  } = props;
  const currentFormatType = useSelector((state) => selectors.getActiveCellFormatType(state));
  const isActive = formatType === currentFormatType;

  const handleClick = () => {
    setCellFormatString(formatType);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={handleClick}
        secondaryLabel={secondaryLabel}
        additionalClass={isActive ? 'active' : ''}
      />
      : (
        <ActionButton
          key={formatType}
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

CellFormatButton.propTypes = propTypes;
CellFormatButton.displayName = 'CellFormatButton';

export default CellFormatButton;