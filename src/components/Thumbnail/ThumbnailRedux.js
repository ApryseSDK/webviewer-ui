import React from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import selectors from 'selectors';
import actions from 'actions';
import { isMobile } from 'helpers/device';

import Thumbnail from './Thumbnail';

const ThumbnailRedux = (props) => {
  const [
    currentPage,
    pageLabels,
    selectedPageIndexes,
    isThumbnailMultiselectEnabled,
    isReaderMode,
    shiftKeyThumbnailPivotIndex,
    isThumbnailSelectingPages,
    thumbnailSelectionMode,
    activeDocumentViewerKey,
    selectionModes
  ] = useSelector(
    (state) => [
      selectors.getCurrentPage(state),
      selectors.getPageLabels(state),
      selectors.getSelectedThumbnailPageIndexes(state),
      selectors.isThumbnailMultiselectEnabled(state),
      selectors.isReaderMode(state),
      selectors.getShiftKeyThumbnailPivotIndex(state),
      selectors.isThumbnailSelectingPages(state),
      selectors.getThumbnailSelectionMode(state),
      selectors.getActiveDocumentViewerKey(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();

  return <Thumbnail {...props} {...{
    currentPage,
    pageLabels,
    selectedPageIndexes,
    isThumbnailMultiselectEnabled,
    isReaderMode,
    dispatch,
    actions,
    isMobile,
    shiftKeyThumbnailPivotIndex,
    isThumbnailSelectingPages,
    thumbnailSelectionMode,
    selectionModes,
    activeDocumentViewerKey,
  }}
  />;
};

export default ThumbnailRedux;
