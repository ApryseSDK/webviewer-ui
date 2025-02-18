import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import ActionButton from 'components/ActionButton';
import DataElements from 'constants/dataElement';
import PropTypes from 'prop-types';
import actions from 'actions';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  type: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

const CellAdjustmentButton = forwardRef((props, ref) => {
  const { isFlyoutItem, type, style, className } = props;
  const dispatch = useDispatch();
  const isActive = false;

  const { dataElement, icon, title } = menuItems['cellAdjustment'];

  const handleClick = () => {
    // handle button click
    dispatch(actions.setFlyoutToggleElement(dataElement));
    dispatch(actions.toggleElement(DataElements.CELL_ADJUSTMENT_FLYOUT));
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

CellAdjustmentButton.propTypes = propTypes;
CellAdjustmentButton.displayName = 'CellAdjustmentButton';

export default CellAdjustmentButton;
