import { useEffect } from 'react';
import core from 'core';
import getRootNode from 'helpers/getRootNode';
import { shallowEqual, useSelector } from 'react-redux';
import selectors from 'selectors';

export default (handler) => {
  const [
    activeDocumentViewerKey,
    isMultiViewerMode,
  ] = useSelector(
    (state) => [
      selectors.getActiveDocumentViewerKey(state),
      selectors.isMultiViewerMode(state),
    ],
    shallowEqual,
  );

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

      const documentContainer =
        isMultiViewerMode
          ? getRootNode().querySelector(`#DocumentContainer${activeDocumentViewerKey}`)
          : getRootNode().querySelector('.DocumentContainer');
      const clickedOnDocumentContainer = documentContainer.contains(e.target);

      if (
        clickedOnDocumentContainer &&
        // when clicking on these two elements we want to display the default context menu so that users can use auto-correction, look up dictionary, etc...
        !(clickedOnInput || clickedOnTextarea || clickedOnFreeTextarea)
      ) {
        e.preventDefault();
        handler(e);
      }
    };

    getRootNode().addEventListener('contextmenu', listener);
    core.addEventListener('longTap', listener, null, activeDocumentViewerKey);
    return () => {
      getRootNode().removeEventListener('contextmenu', listener);
      core.removeEventListener('longTap', listener, null, activeDocumentViewerKey);
    };
  }, [handler, activeDocumentViewerKey, isMultiViewerMode]);
};
