import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import { CELL_ACTION_OPTIONS } from 'constants/spreadsheetEditor';
import capitalize from 'helpers/capitalize';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import performClipboardActionOnCells from 'src/helpers/performClipboardActionOnCells';

const propTypes = {
  actionType: PropTypes.oneOf(Object.values(CELL_ACTION_OPTIONS)).isRequired,
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};

const CopyPasteCutButton = forwardRef((props, ref) => {
  const { isFlyoutItem, actionType, style, className } = props;
  const buttonSelector = `cell${capitalize(actionType)}`;
  const {
    dataElement = menuItems[buttonSelector].dataElement,
    img: icon = menuItems[buttonSelector].icon,
    title = menuItems[buttonSelector].title,
  } = props;
  const isActive = false;
  const isEnabled = useSelector((state) => {
    const selectorName = `getCan${capitalize(actionType)}`;
    const selector = selectors[selectorName];
    if (!selector) {
      return false;
    }
    return selector(state);
  });

  const handleClick = () => {
    performClipboardActionOnCells(actionType);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={handleClick}
        additionalClass={isActive ? 'active' : ''}
        disabled={!isEnabled}
      />
      : (
        <ActionButton
          disabled={!isEnabled}
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