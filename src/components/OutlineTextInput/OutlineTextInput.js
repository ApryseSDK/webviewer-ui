import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';

import './OutlineTextInput.scss';

const OutlineTextInput = ({ className, defaultValue, onEnter, onEscape, ...rest }) => {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter(e);
    }

    if (e.key === 'Escape' && onEscape) {
      onEscape(e);
    }
  }

  return (
    <input
      className={classNames({
        OutlineTextInput: true,
        [className]: !!className,
      })}
      ref={inputRef}
      type="text"
      defaultValue={defaultValue}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
}

export default OutlineTextInput;
