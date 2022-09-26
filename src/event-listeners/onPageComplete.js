import core from 'core';

export default (store, documentViewerKey) => (pageNumber) => {
  const state = store.getState();
  if (state.viewer.isAccessibleMode) {
    core.getDocument(documentViewerKey).loadPageText(pageNumber, (text) => {
      const textContainer = document.createElement('div');
      textContainer.tabIndex = 0;
      // TODO: page-num
      textContainer.textContent = `Page ${pageNumber}.\n${text}\nEnd of page ${pageNumber}.`;
      textContainer.style = 'font-size: 5px; overflow: auto; position: absolute; z-index: -99999; top: 0; bottom: 0;';
      const id = `pageText${pageNumber}`;
      textContainer.id = id;
      // remove duplicate / pre-existing divs first before appending again
      // TODO: page-num
      const pageContainerElement = core.getViewerElement(documentViewerKey).querySelector(`#pageContainer${pageNumber}`);
      const existingTextContainer = pageContainerElement.querySelector(`#${id}`);
      if (existingTextContainer) {
        pageContainerElement.removeChild(existingTextContainer);
      }
      pageContainerElement.appendChild(textContainer);
    });
  }
};
