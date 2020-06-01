export function isKeyboardNav() {
  return document.documentElement.getAttribute('data-tabbing') === 'true';
}
