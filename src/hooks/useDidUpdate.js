import { useEffect, useRef } from 'react';

export default (callback = () => {}, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    return callback();
  // eslint-disable-next-line
  }, deps);
};
