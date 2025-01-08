export const elementsHaveChanged = (newElements, oldElements) => {
  if (newElements.length !== oldElements.length) {
    return true;
  }
  for (let i = 0; i < newElements.length; i++) {
    if (newElements[i] !== oldElements[i]) {
      return true;
    }
  }
  return false;
};

export const getElementToFocusOnIndex = (newFocusableElements, oldFocusableElements, currentFocusIndex) => {
  if (currentFocusIndex < 0) {
    return;
  }
  const currentElement = oldFocusableElements[currentFocusIndex];
  const newIndex = Array.from(newFocusableElements).findIndex((element) => element === currentElement);

  // If there is an element in the new focusable elements that is the same as the current element, focus on it
  if (newIndex !== -1) {
    return newIndex;
  }
  // If the current element is not in the new focusable elements, focus on the next element in the list (if there is one)
  if (newFocusableElements[currentFocusIndex]) {
    return currentFocusIndex;
  }
  // If there is no next element in the list, focus on the previous element in the list (if there is one)
  const fallbackIndex = newFocusableElements[currentFocusIndex - 1]
    ? currentFocusIndex - 1
    : newFocusableElements.length - 1;

  return fallbackIndex;
};
