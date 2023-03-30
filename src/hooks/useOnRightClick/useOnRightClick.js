import { useEffect } from 'react';
import core from 'core';

export default (handler) => {
  useEffect(() => {
    const listener = (e) => {
      const { tagName } = e.target;
      const clickedOnInput = tagName === 'INPUT';
      const clickedOnTextarea = tagName === 'TEXTAREA';
      const clickedOnFreeTextarea = !!((
        e.target.className === 'ql-editor'
        || e.target.parentNode.className === 'ql-editor'
        || e.target.parentNode.parentNode.className === 'ql-editor'
      ));

      const clickedOnDocumentContainer = document
        .querySelector('.DocumentContainer')
        .contains(e.target);

      if (
        clickedOnDocumentContainer &&
        // when clicking on these two elements we want to display the default context menu so that users can use auto-correction, look up dictionary, etc...
        !(clickedOnInput || clickedOnTextarea || clickedOnFreeTextarea)
      ) {
        e.preventDefault();
        handler(e);
      }
    };

    document.addEventListener('contextmenu', listener);
    core.addEventListener('longTap', listener);
    return () => {
      document.removeEventListener('contextmenu', listener);
      core.removeEventListener('longTap', listener);
    };
  }, [handler]);
};