import React, { useRef, useImperativeHandle, useLayoutEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import NoteContext from 'components/Note/Context';

const propTypes = {
  // same the value attribute of a HTML textarea element
  value: PropTypes.string,
  // same the placeholder attribute of a HTML textarea element
  placeholder: PropTypes.string,
  // same the onChange attribute of a HTML textarea element
  onChange: PropTypes.func.isRequired,
  // same the onBlur attribute of a HTML textarea element
  onBlur: PropTypes.func,
  // same the onBlur attribute of a HTML textarea element
  onFocus: PropTypes.func,
  // a function that will be invoked when Ctrl + Enter or Cmd + Enter are pressed
  onSubmit: PropTypes.func,
};

const AutoResizeTextarea = ({
  value = '',
  onChange,
  onSubmit = () => {},
  onBlur = () => {},
  onFocus = () => {},
  placeholder = '',
}, ref) => {
  const { resize } = useContext(NoteContext);
  const textareaRef = useRef();
  const TEXTAREA_HEIGHT = '30px';

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current.focus(),
    blur: () => textareaRef.current.blur(),
  }));

  useLayoutEffect(() => {
    resizeHeight();
  }, []);

  useLayoutEffect(() => {
    // it is possible that the height of the textarea has changed due to
    // the previous value. So we need to reset it if value becomes ''
    if (!value) {
      textareaRef.current.style.height = TEXTAREA_HEIGHT;
    }
  }, [value]);

  const handleChange = e => {
    resizeHeight();
    onChange(e.target.value);
  };

  const resizeHeight = () => {
    // for auto-resize the height of the textarea
    // https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
    // 1. make the height small enough so that we know the scroll bar height
    // 2. make the height a bit bigger than the scroll bar height to finish resizing
    textareaRef.current.style.height = TEXTAREA_HEIGHT;
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;

    // when the height of the textarea changes, we also want to call resize
    // to clear the cell measurer cache and update the note height in the virtualized list
    resize();
  };

  const handleKeyDown = e => {
    // (Cmd/Ctrl + Enter)
    if ((e.metaKey || e.ctrlKey) && e.which === 13) {
      onSubmit(e);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      value={value}
      placeholder={placeholder}
    />
  );
};

AutoResizeTextarea.propTypes = propTypes;

export default React.forwardRef(AutoResizeTextarea);