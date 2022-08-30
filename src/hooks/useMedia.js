import { useState, useEffect } from 'react';

// https://usehooks.com/useMedia/
export default (queries, values, defaultValue) => {
  // Array containing a media query list for each query
  const mediaQueryLists = queries.map((q) => window.matchMedia(`screen and ${q}`));

  // Function that gets value based on matching media query
  const getValue = (initial) => {
    // HACK: Reading window.innerWidth prevents a bug where checking mql.matches
    // in a background tab on chromium returns true even though it isn't.
    if (initial) {
      window.innerWidth;
    }
    // Get index of first media query that matches
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    // Return related value or defaultValue if none
    return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
  };

  // State and setter for matched value
  const [value, setValue] = useState(() => getValue(true));

  useEffect(
    () => {
      // Event listener callback
      // Note: By defining getValue outside of useEffect we ensure that it has ...
      // ... current values of hook args (as this hook callback is created once on mount).
      const handler = () => setValue(() => getValue());
      // Set a listener for each media query with above handler as callback.
      mediaQueryLists.forEach((mql) => mql.addListener(handler));
      // Remove listeners on cleanup
      return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Empty array ensures effect is only run on mount and unmount
  );

  return value;
};
