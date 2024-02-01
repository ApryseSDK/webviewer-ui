import getRootNode from 'helpers/getRootNode';

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

export function escapePressListener(event, onEscapeFunction) {
  if (event.key === 'Escape') {
    onEscapeFunction(event);
  }
}

export function createAnnouncement(onClickAnnouncement) {
  if (onClickAnnouncement) {
    const el = document.createElement('div');
    const id = `speak-${Date.now()}`;
    el.setAttribute('id', id);
    el.setAttribute('aria-live', 'assertive');
    el.classList.add('visually-hidden');
    const parent = !window.isApryseWebViewerWebComponent ? document.body : getRootNode();
    parent.appendChild(el);

    window.setTimeout(function() {
      getRootNode().getElementById(id).innerText = onClickAnnouncement;
    }, 100);

    window.setTimeout(function() {
      parent.removeChild(getRootNode().getElementById(id));
    }, 1000);
  }
}
