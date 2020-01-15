import React, {
  useRef,
  useLayoutEffect,
  useContext,
} from 'react';
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

const AutoResizeTextarea = React.forwardRef(
  (
    {
      value = '',
      onChange,
      onSubmit = () => {},
      onBlur = () => {},
      onFocus = () => {},
      placeholder = '',
    },
    forwardedRef,
  ) => {
    const { resize } = useContext(NoteContext);
    const prevHeightRef = useRef();
    const textareaRef = useRef();
    const TEXTAREA_HEIGHT = '28px';

    useLayoutEffect(() => {
      // for auto-resize the height of the textarea
      // https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
      // 1. make the height small enough so that we know the scroll bar height
      // 2. make the height a bit bigger than the scroll bar height to finish resizing
      textareaRef.current.style.height = TEXTAREA_HEIGHT;

      const currHeight = textareaRef.current.scrollHeight + 2;
      const hasScrollBar = currHeight !== 2;
      if (hasScrollBar) {
        textareaRef.current.style.height = `${currHeight}px`;

        // when the height of the textarea changes, we also want to call resize
        // to clear the cell measurer cache and update the note height in the virtualized list
        if (!prevHeightRef.current || prevHeightRef.current !== currHeight) {
          resize();
        }

        prevHeightRef.current = currHeight;
      }
    }, [resize, value]);

    const handleChange = e => {
      onChange(e.target.value);
    };

    const handleKeyDown = e => {
      // (Cmd/Ctrl + Enter)
      if ((e.metaKey || e.ctrlKey) && e.which === 13) {
        onSubmit(e);
      }
    };

    return (
      <textarea
        ref={el => {
          textareaRef.current = el;
          forwardedRef(el);
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        placeholder={placeholder}
      />
    );
  },
);

AutoResizeTextarea.propTypes = propTypes;

export default AutoResizeTextarea;
