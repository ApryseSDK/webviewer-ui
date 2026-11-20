import { useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';
import InstanceIdContext from 'src/context/InstanceIdContext';
import { bindToInstance } from 'core/documentViewers';

/**
 * Debounced callback that runs against this component's instance,
 * not whichever is ambient when the timer fires.
 * Keeps its timer across renders and always calls the latest `callback`;
 * `options` is read on first render only.
 * @ignore
 */
export default function useInstanceDebouncedCallback(callback, wait, options) {
  const instanceId = useContext(InstanceIdContext);
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const debounced = useMemo(
    () => debounce(bindToInstance(instanceId, (...args) => callbackRef.current(...args)), wait, options),
    [instanceId, wait],
  );

  useEffect(() => () => debounced.cancel(), [debounced]);

  return debounced;
}
