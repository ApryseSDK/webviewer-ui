import core from 'core';

export default store => (e, pageIndex) => {
  const state = store.getState();
  if (state.viewer.isAccessible) {
    core.getDocument().loadPageText(pageIndex, text => {
      const textContainer = document.createElement('div');
      textContainer.tabIndex = 0;
      textContainer.textContent = `Page ${pageIndex + 1}.\n${text}\nEnd of page ${pageIndex + 1}.`;
      textContainer.style = 'height: 100%;';
      textContainer.id = 'pageText' + pageIndex;
      document.getElementById('pageContainer' + pageIndex).appendChild(textContainer);
    });
  }
};