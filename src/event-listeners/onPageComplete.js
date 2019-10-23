import core from 'core';

export default store => pageIndex => {
  const state = store.getState();
  if (state.viewer.isAccessibleMode) {
    core.getDocument().loadPageText(pageIndex, text => {
      const textContainer = document.createElement('div');
      textContainer.tabIndex = 0;
      textContainer.textContent = `Page ${pageIndex + 1}.\n${text}\nEnd of page ${pageIndex + 1}.`;
      textContainer.style = 'height: 100%; font-size: 5px; overflow: auto; position: relative; z-index: -99999';
      textContainer.id = `pageText${pageIndex}`;
      document.getElementById(`pageContainer${pageIndex}`).appendChild(textContainer);
    });
  }
};
