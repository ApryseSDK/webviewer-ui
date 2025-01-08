import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import core from 'core';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';

const propTypes = {
  isIncreaseIndent: PropTypes.bool.isRequired,
  isFlyoutItem: PropTypes.bool,
};

const IndentButton = forwardRef((props, ref) => {
  const { isFlyoutItem, isIncreaseIndent } = props;
  const indentType = isIncreaseIndent ? 'increase' : 'decrease';

  const handleClick = async () => {
    isIncreaseIndent
      ? await core.getOfficeEditor().increaseIndent()
      : await core.getOfficeEditor().decreaseIndent();
  };

  const { dataElement, icon, title } = isIncreaseIndent ? menuItems.increaseIndentButton : menuItems.decreaseIndentButton;

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={async () => {
        await handleClick();
      }} />
      : (
        <ActionButton
          key={indentType}
          className={`PresetButton indent-button ${indentType}-indent-button`}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={async () => {
            await handleClick();
          }}
        />
      )
  );
});

IndentButton.propTypes = propTypes;
IndentButton.displayName = 'IndentButton';

export default IndentButton;