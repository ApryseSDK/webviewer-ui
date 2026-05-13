/**
 * Pre-creates the <style> element that react-draggable looks for before injecting
 * its own inline style (used by the "user-select hack"). If the element already
 * exists, react-draggable will reuse it instead of creating a new one, which
 * avoids CSP violations under a strict nonce-based style-src policy.
 *
 * Must be called once before any Draggable component renders.
 *
 * react-draggable always looks up the element via node.ownerDocument.getElementById(),
 * which resolves to `document` — even for elements inside a shadow root. So we must
 * always place the element in document.head. In WebComponent mode we also clone it
 * into the shadow root so the CSS actually applies inside the shadow boundary.
 *
 * @param {string} [nonce] - CSP nonce to set on the style element.
 */
import getRootNode from 'helpers/getRootNode';

const STYLE_CONTENT =
  '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n' +
  '.react-draggable-transparent-selection *::selection {all: inherit;}\n';

function createStyleEl(nonce) {
  const el = document.createElement('style');
  if (nonce) {
    el.nonce = nonce;
  }
  el.textContent = STYLE_CONTENT;
  return el;
}

export default function ensureReactDraggableStyleEl(nonce) {
  if (typeof document === 'undefined') {
    return;
  }

  const id = 'react-draggable-style-el';

  // Always ensure the element exists in document (where react-draggable looks).
  let docEl = document.getElementById(id);
  if (!docEl) {
    docEl = createStyleEl(nonce);
    docEl.id = id;
    document.head.appendChild(docEl);
  } else if (nonce && docEl.nonce !== nonce) {
    docEl.nonce = nonce;
  }

  // In WebComponent mode, also inject into the shadow root so the CSS applies.
  const rootNode = getRootNode();
  if (rootNode !== document) {
    const shadowEl = rootNode?.querySelector?.(`#${id}`);
    if (!shadowEl) {
      const clone = createStyleEl(nonce);
      clone.id = id;
      if (typeof rootNode?.appendChild === 'function') {
        rootNode.appendChild(clone);
      }
    } else if (nonce && shadowEl.nonce !== nonce) {
      shadowEl.nonce = nonce;
    }
  }
}
