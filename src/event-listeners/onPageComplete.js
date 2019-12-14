import core from 'core';

export default store => pageIndex => {
  const state = store.getState();
  if (state.viewer.isAccessibleMode) {
    core.getDocument().loadPageText(pageIndex, text => {
      const textContainer = document.createElement('div');
      const className = 'accessible-text';
      textContainer.classList.add(className);
      textContainer.tabIndex = 0;
      textContainer.textContent = `Page ${pageIndex + 1}.\n${text}\nEnd of page ${pageIndex + 1}.`;
      textContainer.style = 'font-size: 5px; overflow: auto; position: relative; z-index: -99999';
      textContainer.id = `pageText${pageIndex}`;
      const pageContainerElement = document.getElementById(`pageContainer${pageIndex}`);
      const existingTextContainer = pageContainerElement.querySelector(`.${className}`);
      if (existingTextContainer) {
        pageContainerElement.removeChild(existingTextContainer);
      }
      pageContainerElement.appendChild(textContainer);
    });
  }
};
