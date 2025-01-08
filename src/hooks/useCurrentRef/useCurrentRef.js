import { useEffect, useRef } from 'react';
export function useCurrentRef(toRef) {
  const toRefRef = useRef(toRef);
  useEffect(() => {
    toRefRef.current = toRef;
  });
  return toRefRef;
}