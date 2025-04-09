import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import DataElements from 'constants/dataElement';
import actions from 'actions';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  formatType: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  secondaryLabel: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

const CellFormatButton = forwardRef((props, ref) => {
  const { isFlyoutItem, formatType, secondaryLabel, style, className } = props;
  const dispatch = useDispatch();
  const isActive = false;

  const key = `${formatType.charAt(0).toLowerCase()}${formatType.slice(1)}`;
  const { dataElement, icon, title } = menuItems[key];

  const handleClick = () => {
    // handle button click
    if (dataElement === DataElements.CELL_FORMAT_MORE_BUTTON) {
      dispatch(actions.setFlyoutToggleElement(dataElement));
      dispatch(actions.toggleElement(DataElements.CELL_FORMAT_MORE_FLYOUT));
    }
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