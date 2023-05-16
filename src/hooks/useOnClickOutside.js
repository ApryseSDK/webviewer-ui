import { useEffect } from 'react';
import getRootNode from 'helpers/getRootNode';

// https://usehooks.com/useOnClickOutside/
export default (ref, handler) => {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };
      let browserDocument = document;
      if (window.isApryseWebViewerWebComponent) {
        browserDocument = getRootNode().getElementById('app');
      }
      browserDocument.addEventListener('mousedown', listener);
      browserDocument.addEventListener('touchstart', listener);

      return () => {
        browserDocument.removeEventListener('mousedown', listener);
        browserDocument.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler],
  );
};
