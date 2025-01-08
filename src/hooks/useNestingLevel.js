import { useState, useEffect } from 'react';

const useNestingLevel = (elementRef, nestingSelector) => {
  const [level, setLevel] = useState(1);

  useEffect(() => {
    let currentLevel = -1;
    let pointer = elementRef?.current;
    while (pointer) {
      currentLevel++;
      pointer = pointer.parentElement.closest(nestingSelector);
    }
    setLevel(currentLevel);
  }, [elementRef]);

  return level;
};

export default useNestingLevel;