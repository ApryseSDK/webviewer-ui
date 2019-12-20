import core from 'core';

export default store => pageIndex => {
  const state = store.getState();
  if (state.viewer.isAccessibleMode) {
    core.getDocument().loadPageText(pageIndex, text => {
      const textContainer = document.createElement('div');
      textContainer.tabIndex = 0;
      textContainer.textContent = `Page ${pageIndex + 1}.\n${text}\nEnd of page ${pageIndex + 1}.`;
      textContainer.style = 'font-size: 5px; overflow: auto; position: relative; z-index: -99999';
      const id = `pageText${pageIndex}`;
      textContainer.id = id;
      // remove duplicate / pre-existing divs first before appending again
      const pageContainerElement = document.getElementById(`pageContainer${pageIndex}`);
      const existingTextContainer = pageContainerElement.querySelector(`#${id}`);
      if (existingTextContainer) {
        pageContainerElement.removeChild(existingTextContainer);
      }
      pageContainerElement.appendChild(textContainer);
    });
  }
};
