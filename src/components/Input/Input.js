import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import useFocus from 'hooks/useFocus';
import Icon from 'components/Icon';
import './Input.scss';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  message = 'default',
  messageText,
  fillWidth,
  wrapperClassName,
  padMessageText,
  className,
  onFocus,
  onBlur,
  rightElement,
  leftElement,
  type = 'text',
  disabled,
  ...props
}, ref) => {
  const { focused, handleOnFocus, handleOnBlur } = useFocus(onFocus, onBlur);

  const rightIcon = useMemo(() => {
    if (rightElement) {
      return rightElement;
    }

    let icon;
    if (message === 'warning') {
      icon = 'icon-alert';
    } else if (message === 'error') {
      icon = 'icon-error';
    }

    return icon ? <Icon className="ui__input__icon" glyph={icon} /> : undefined;
  }, [message, rightElement]);

  const wrapperClass = classNames(
    'ui__base',
    'ui__input__wrapper',
    {
      'ui__input__wrapper--fill': fillWidth,
      'ui__input__wrapper--pad': padMessageText && !messageText,
    },
    wrapperClassName,
  );

  const mainClass = classNames(
    'ui__input',
    `ui__input--message-${message}`,
    { 'ui__input--focused': focused }
  );

  const inputClass = classNames(
    'ui__input__input',
    { 'ui__input__input--disabled': disabled },
    className
  );

  return (
    <div className={wrapperClass}>
      <div className={mainClass}>
        {leftElement}
        <input
          {...props}
          type={type}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          className={inputClass}
          disabled={disabled}
          ref={ref}
        />
        {rightIcon}
      </div>
      {messageText && <div className="ui__input__messageText">{messageText}</div>}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  message: PropTypes.oneOf(['default', 'warning', 'error']),
  messageText: PropTypes.string,
  fillWidth: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  padMessageText: PropTypes.bool,
  className: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  rightElement: PropTypes.node,
  leftElement: PropTypes.node,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};
export default Input;
