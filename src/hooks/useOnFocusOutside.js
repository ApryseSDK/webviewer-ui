import { useCallback, useEffect } from 'react';

const useOnFocusOutside = (ref, callback) => {
  const callbackOnFocusOut = useCallback(
    e => {
      if (!ref.current || ref.current.contains(e.relatedTarget)) {
        return;
      }
      callback(e);
    },
    [callback],
  );

  useEffect(() => {
    if (ref.current) {
      ref.current?.removeEventListener('focusout', callbackOnFocusOut);
      ref.current?.addEventListener('focusout', callbackOnFocusOut);
    }

    return () => {
      ref.current?.removeEventListener('focusout', callbackOnFocusOut);
    };
  }, [ref, callbackOnFocusOut]);
};

export default useOnFocusOutside;
