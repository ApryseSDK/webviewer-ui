import React from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import selectors from 'selectors';
import actions from 'actions';
import { isMobile } from 'helpers/device';

import Thumbnail from './Thumbnail';

const ThumbnailRedux = React.forwardRef((props, ref) => {
  const [
    currentPage,
    pageLabels,
    selectedPageIndexes,
    isThumbnailMultiselectEnabled,
    isReaderMode,
    isDocumentReadOnly,
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
      selectors.isDocumentReadOnly(state),
      selectors.getShiftKeyThumbnailPivotIndex(state),
      selectors.isThumbnailSelectingPages(state),
      selectors.getThumbnailSelectionMode(state),
      selectors.getActiveDocumentViewerKey(state),
    ],
    shallowEqual,
  );

  const dispatch = useDispatch();

  return <Thumbnail {...props} {...{
    ref,
    currentPage,
    pageLabels,
    selectedPageIndexes,
    isThumbnailMultiselectEnabled,
    isReaderModeOrReadOnly: isReaderMode || isDocumentReadOnly,
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
});
ThumbnailRedux.displayName = 'ThumbnailRedux';
export default ThumbnailRedux;
