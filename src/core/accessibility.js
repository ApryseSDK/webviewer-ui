export function isKeyboardNav() {
  return document.documentElement.getAttribute('data-tabbing') === 'true';
}


export function findFocusableIndex(elements, toFind) {
  let index = -1;
  if (!toFind) {
    return index;
  }
  elements.forEach((element, i) => {
    if (index !== -1) {
      return;
    }
    if (element === toFind) {
      index = i;
    }
  });
  return index;
}