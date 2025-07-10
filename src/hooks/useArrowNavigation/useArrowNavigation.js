import { useState, useEffect, useRef, useCallback } from 'react';
import findFocusableElements from 'helpers/findFocusableElements';
import getRootNode from 'helpers/getRootNode';
import { elementsHaveChanged } from 'helpers/keyboardNavigationHelper';

export default function useArrowNavigation(
  containerRef,
  items = [],
  {
    orientation = 'horizontal',
    manageContainerTabIndex = false,
  } = {}
) {
  const [lastFocusIndex, setLastFocusIndex] = useState(-1);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const [focusableElements, setFocusableElements] = useState([]);
  const prevFocusableElementsRef = useRef([]);

  const resetTabIndex = useCallback(() => {
    if (containerRef.current && containerRef.current.tabIndex === -1) {
      containerRef.current.tabIndex = 0;
    }
  }, [containerRef]);

  const removeTabIndex = useCallback(() => {
    if (containerRef.current && containerRef.current.tabIndex === 0) {
      containerRef.current.tabIndex = -1;
    }
  }, [containerRef]);

  const updateTabIndexes = useCallback((focusedIndex) => {
    focusableElements.forEach((elem, index) => {
      elem.tabIndex = index === focusedIndex ? 0 : -1;
    });
  }, [focusableElements]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const elems = findFocusableElements(containerRef.current);

    if (elementsHaveChanged(elems, prevFocusableElementsRef.current)) {
      setCurrentFocusIndex(-1);
      setLastFocusIndex(-1);
      const indexToFocus = (lastFocusIndex >= 0 && elems[lastFocusIndex]) ? lastFocusIndex : 0;
      updateTabIndexes(indexToFocus);
      prevFocusableElementsRef.current = elems;
      setFocusableElements(elems);
    }
  }, [containerRef, items, lastFocusIndex, updateTabIndexes]);


  const moveFocus = useCallback((delta) => {
    if (focusableElements.length === 0) {
      return;
    }

    let newFocusIndex = currentFocusIndex;

    if (newFocusIndex === -1) {
      const activeElement = getRootNode().activeElement;
      newFocusIndex = focusableElements.indexOf(activeElement);
      if (newFocusIndex === -1) {
        newFocusIndex = 0;
      }
    }

    newFocusIndex += delta;
    if (newFocusIndex < 0) {
      newFocusIndex = focusableElements.length - 1;
    } else if (newFocusIndex >= focusableElements.length) {
      newFocusIndex = 0;
    }

    setCurrentFocusIndex(newFocusIndex);
    setLastFocusIndex(newFocusIndex);
    focusableElements[newFocusIndex].focus();
    updateTabIndexes(newFocusIndex);

    if (manageContainerTabIndex) {
      removeTabIndex();
    }
  }, [currentFocusIndex, focusableElements, updateTabIndexes, removeTabIndex, manageContainerTabIndex]);


  const handleTabKey = useCallback((e) => {
    if (e.shiftKey) {
      if (currentFocusIndex !== -1) {
        removeTabIndex();
      }
      setLastFocusIndex(currentFocusIndex);
      setCurrentFocusIndex(-1);
    } else {
      setLastFocusIndex(currentFocusIndex);
      setCurrentFocusIndex(-1);
      if (manageContainerTabIndex && containerRef.current) {
        resetTabIndex();
      }
    }
  }, [currentFocusIndex, removeTabIndex, resetTabIndex, manageContainerTabIndex, containerRef]);


  const handleHomeKey = useCallback((e) => {
    e.preventDefault();
    if (focusableElements.length > 0) {
      setCurrentFocusIndex(0);
      setLastFocusIndex(0);
      focusableElements[0].focus();
      updateTabIndexes(0);
    }
  }, [focusableElements, updateTabIndexes, manageContainerTabIndex, containerRef, resetTabIndex]);

  const handleEndKey = useCallback((e) => {
    e.preventDefault();
    if (focusableElements.length > 0) {
      const lastIndex = focusableElements.length - 1;
      setCurrentFocusIndex(lastIndex);
      setLastFocusIndex(lastIndex);
      focusableElements[lastIndex].focus();
      updateTabIndexes(lastIndex);
    }
  }, [focusableElements, updateTabIndexes, manageContainerTabIndex, containerRef, resetTabIndex]);

  const isHorizontal = orientation === 'horizontal';

  const handleArrowKey = useCallback((e, delta) => {
    e.preventDefault();
    moveFocus(delta);
  }, [moveFocus]);

  const handleKeyDown = useCallback((e) => {
    const keyActions = {
      Tab: () => handleTabKey(e),
      Home: () => handleHomeKey(e),
      End: () => handleEndKey(e),
    };

    if (keyActions[e.key]) {
      keyActions[e.key]();
      return;
    }

    if (isHorizontal) {
      const horizontalActions = {
        ArrowRight: () => handleArrowKey(e, 1),
        ArrowLeft: () => handleArrowKey(e, -1),
      };
      if (horizontalActions[e.key]) {
        horizontalActions[e.key]();
      }
    } else {
      const verticalActions = {
        ArrowDown: () => handleArrowKey(e, 1),
        ArrowUp: () => handleArrowKey(e, -1),
      };
      if (verticalActions[e.key]) {
        verticalActions[e.key]();
      }
    }
  }, [handleTabKey, handleHomeKey, handleEndKey, handleArrowKey, isHorizontal]);

  const handleFocusIn = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const focusedElement = getRootNode().activeElement;
    const newIndex = focusableElements.indexOf(focusedElement);

    if (newIndex !== -1) {
      setCurrentFocusIndex(newIndex);
      setLastFocusIndex(newIndex);
      updateTabIndexes(newIndex);
    }

    if (manageContainerTabIndex && containerRef.current) {
      resetTabIndex();
    }
  }, [
    containerRef,
    updateTabIndexes,
    resetTabIndex,
    manageContainerTabIndex,
    focusableElements,
    currentFocusIndex,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      container.addEventListener('focusin', handleFocusIn);
      return () => {
        container.removeEventListener('keydown', handleKeyDown);
        container.removeEventListener('focusin', handleFocusIn);
      };
    }
  }, [containerRef, handleKeyDown, handleFocusIn]);

  useEffect(() => {
    const activeElement = getRootNode().activeElement;
    const isFocusInCurrentContainer = activeElement && containerRef.current?.contains(activeElement);

    if (currentFocusIndex >= 0 && isFocusInCurrentContainer && focusableElements[currentFocusIndex]) {
      focusableElements[currentFocusIndex].focus();
      updateTabIndexes(currentFocusIndex);
    }
  }, [currentFocusIndex, focusableElements, containerRef, updateTabIndexes]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new MutationObserver(() => {
      const elements = findFocusableElements(containerRef.current);
      if (elementsHaveChanged(elements, focusableElements)) {
        setFocusableElements(elements);
        const indexToFocus = (lastFocusIndex >= 0 && elements[lastFocusIndex]) ? lastFocusIndex : 0;
        updateTabIndexes(indexToFocus);
      }
    });

    observer.observe(containerRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [containerRef, focusableElements, lastFocusIndex, updateTabIndexes]);

  return {
    focusableElements,
  };
}