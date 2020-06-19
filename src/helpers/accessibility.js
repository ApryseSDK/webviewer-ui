export function isKeyboardNav() {
  return document.documentElement.getAttribute('data-tabbing') === 'true';
}

export function findFocusableIndex(elements, toFind) {
  let index = -1;
  if (!toFind) {
    return index;
  }
  for (let i = 0; i < elements.length; i++) {
    if (elements[i] === toFind) {
      index = i;
      break;
    }
  }
  return index;
}
