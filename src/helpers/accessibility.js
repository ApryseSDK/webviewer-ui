import getRootNode from 'helpers/getRootNode';
import core from 'core';

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

export function shouldEndAccessibleReadingOrderMode() {
  const accessibleReadingOrderManager = core.getDocumentViewer()?.getAccessibleReadingOrderManager();
  accessibleReadingOrderManager?.endAccessibleReadingOrderMode();
}

export function prepareAccessibleModeContent(store, pageNumber) {
  const state = store.getState();
  const documentViewerKey = state.viewer.activeDocumentViewerKey;

  if (state.viewer.shouldAddA11yContentToDOM) {
    core.getDocument(documentViewerKey).loadPageText(pageNumber, (text) => {
      const id = `pageText${pageNumber}`;
      // remove duplicate / pre-existing divs first before appending again
      const pageContainerElement = core.getViewerElement(documentViewerKey).querySelector(`#pageContainer${pageNumber}`);
      const existingTextContainer = pageContainerElement.querySelector(`#${id}`);
      if (existingTextContainer) {
        pageContainerElement.removeChild(existingTextContainer);
      }

      const textContainer = document.createElement('div');
      textContainer.tabIndex = 0;
      textContainer.textContent = `Page ${pageNumber}.\n${text}\nEnd of page ${pageNumber}.`;
      textContainer.style = 'font-size: 5px; overflow: auto; position: absolute; z-index: -99999; top: 0; bottom: 0;';
      textContainer.id = id;
      // add pageText to the beginning of the pageContainer so that it comes first in tab order
      pageContainerElement.prepend(textContainer);
    });
  }
}
