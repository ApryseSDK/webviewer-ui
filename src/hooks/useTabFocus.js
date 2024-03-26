import { useEffect } from 'react';
import selectors from 'selectors';
import { useSelector } from 'react-redux';
import { focusableElementDomString } from '@pdftron/webviewer-react-toolkit';
import getRootNode from 'helpers/getRootNode';
import core from 'core';

export default function useTabFocus() {
  const [pageNumber] = useSelector((state) => [
    selectors.getCurrentPage(state),
  ]);

  useEffect(() => {
    const getNextFocusableElement = (currentElement, direction) => {
      const focusable = getRootNode().querySelectorAll(focusableElementDomString);
      const focusableArray = Array.from(focusable);
      const currentIndex = focusableArray.indexOf(currentElement);
      const arrayLength = focusableArray.length;

      let nextIndex = (currentIndex + direction + arrayLength) % arrayLength;

      while (nextIndex !== currentIndex) {
        const nextElement = focusableArray[nextIndex];
        if (isElementVisible(nextElement)) {
          return nextElement;
        }
        nextIndex = (nextIndex + direction + arrayLength) % arrayLength;
      }

      return null;
    };

    const isElementVisible = (element) => {
      const computedStyle = window.getComputedStyle(element);
      return element && (element.offsetParent !== null || computedStyle.position === 'fixed');
    };

    const keydownListener = (e) => {
      if (e.key === 'Tab') {
        const activeElement = getRootNode().activeElement;
        let nextElement;
        if (e.shiftKey) {
          nextElement = getNextFocusableElement(activeElement, -1);
        } else {
          nextElement = getNextFocusableElement(activeElement, 1);
        }
        const visiblePages = core.getDocumentViewer().getDisplayModeManager().getVisiblePages();
        const currentPageContainers = visiblePages.map((page) => getRootNode().querySelector(`#pageContainer${page}`));
        const isActiveElementInContainers = currentPageContainers.some((container) => container.contains(document.activeElement));
        // get the correct page if the last selected element was outside of the visible page containers or if the active element is the document
        if ((nextElement.id.includes('pageText') && !isActiveElementInContainers) || activeElement?.className === 'document') {
          e.preventDefault();
          const activePageText = getRootNode().querySelector(`#pageText${pageNumber}`);
          activePageText.focus();
        }
      }
    };

    window.addEventListener('keydown', keydownListener);
    return () => window.removeEventListener('keydown', keydownListener);
  }, [pageNumber]);
}