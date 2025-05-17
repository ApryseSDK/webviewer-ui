import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import { CELL_ACTION_OPTIONS } from 'constants/spreadsheetEditor';
import capitalize from 'helpers/capitalize';

const propTypes = {
  actionType: PropTypes.oneOf(Object.values(CELL_ACTION_OPTIONS)).isRequired,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};

const CopyPasteCutButton = forwardRef((props, ref) => {
  const { isFlyoutItem, actionType, style, className } = props;
  const isActive = false;

  const buttonSelector = `cell${capitalize(actionType)}`;
  const { dataElement, icon, title } = menuItems[buttonSelector];

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
          key={actionType}
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

CopyPasteCutButton.propTypes = propTypes;
CopyPasteCutButton.displayName = 'CopyPasteCutButton';

export default CopyPasteCutButton;