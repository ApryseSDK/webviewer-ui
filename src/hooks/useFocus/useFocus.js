import { useCallback, useState } from 'react';

/**
 * Returns handlers for onFocus and onBlur, as well as a property focused which
 * is true if the component or any child is being focused.
 * @param onFocus The onFocus prop if it's available.
 * @param onBlur The onBlur prop if it's available.
 */
export default function useFocus(onFocus, onBlur) {
  const [focused, setFocused] = useState(false);

  const handleOnFocus = useCallback(
    (event) => {
      setFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleOnBlur = useCallback(
    (event) => {
      setFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  return { focused, handleOnFocus, handleOnBlur };
}