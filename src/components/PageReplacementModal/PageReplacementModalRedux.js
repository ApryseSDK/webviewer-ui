import React from 'react';
import selectors from 'selectors';
import actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import PageReplacementModalContainer from './PageReplacementModalContainer';

function PageReplacementModalRedux(props) {
  const dispatch = useDispatch();
  const closePageReplacement = () => {
    dispatch(actions.closeElement('pageReplacementModal'));
  };

  const selectableFiles = useSelector((state) => selectors.getPageReplacementFileList(state));

  const [isOpen] = useSelector((state) => [
    selectors.isElementOpen(state, 'pageReplacementModal'),
  ]);

  const selectedThumbnailPageIndexes = useSelector((state) => selectors.getSelectedThumbnailPageIndexes(state)
  );

  const selectedTab = useSelector((state) => selectors.getSelectedTab(state, 'pageReplacementModal')
  );

  const newProps = {
    ...props,
    closePageReplacement,
    selectableFiles,
    isOpen,
    selectedThumbnailPageIndexes,
    selectedTab,
  };

  return <PageReplacementModalContainer {...newProps} />;
}

export default PageReplacementModalRedux;