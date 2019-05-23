import core from 'core';

export default store => (e, pageIndex) => {
  const state = store.getState();
  if (state.document.accessibleMode) {
    core.getDocument().loadPageText(pageIndex, text => {
      const textContainer = document.createElement('div');
      textContainer.tabIndex = 0;
      textContainer.textContent = text;
      textContainer.style = 'height: 100%;';
      textContainer.id = 'pageText' + pageIndex;
      document.getElementById('pageContainer' + pageIndex).appendChild(textContainer);
    });
  }
};