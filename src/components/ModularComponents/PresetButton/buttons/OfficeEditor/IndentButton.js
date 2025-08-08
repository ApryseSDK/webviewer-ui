import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import core from 'core';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import classNames from 'classnames';

const propTypes = {
  isIncreaseIndent: PropTypes.bool.isRequired,
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};

const IndentButton = forwardRef((props, ref) => {
  const { isFlyoutItem, isIncreaseIndent, style, className } = props;
  const menuItem = isIncreaseIndent ? menuItems.increaseIndentButton : menuItems.decreaseIndentButton;
  const {
    dataElement = menuItem.dataElement,
    img: icon = menuItem.icon,
    title = menuItem.title,
  } = props;
  const indentType = isIncreaseIndent ? 'increase' : 'decrease';

  const handleClick = async () => {
    isIncreaseIndent
      ? await core.getOfficeEditor().increaseIndent()
      : await core.getOfficeEditor().decreaseIndent();
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={async () => {
        await handleClick();
      }} />
      : (
        <ActionButton
          key={indentType}
          className={classNames({
            PresetButton: true,
            'indent-button': true,
            [`${indentType}-indent-button`]: true,
            [className]: className
          })}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={async () => {
            await handleClick();
          }}
          style={style}
        />
      )
  );
});

IndentButton.propTypes = propTypes;
IndentButton.displayName = 'IndentButton';

export default IndentButton;