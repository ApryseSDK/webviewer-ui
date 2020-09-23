import React, {
  useRef,
  useLayoutEffect,
  useImperativeHandle
} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
};

const AutoResizeTextarea = React.forwardRef(
  ({ value, onChange, onKeyDown, onBlur, onFocus, placeholder }, ref) => {
    const textareaRef = useRef();
    useImperativeHandle(ref, () => textareaRef.current);
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
      }
    }, [value]);

    return (
      <textarea
        ref={textareaRef}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    );
  },
);

AutoResizeTextarea.propTypes = propTypes;

export default AutoResizeTextarea;
