import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import LoadingSkeleton from 'components/LoadingSkeleton';
import LoadingModal from 'components/LoadingModal';
import ProgressModal from 'components/ProgressModal';
import DataElements from 'constants/dataElement';
import LoadingScreenContexts from 'constants/loadingScreenContexts';
import LoadingScreenStyles from 'constants/loadingScreenStyles';
import selectors from 'selectors';

const LoadingScreen = () => {
  const [isLoadingModalOpen, isProgressModalOpen, loadingScreenContext, loadingScreenStyle, isMultiViewerMode] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElements.LOADING_MODAL),
      selectors.isElementOpen(state, DataElements.PROGRESS_MODAL),
      selectors.getLoadingScreenContext(state),
      selectors.getLoadingScreenStyle(state),
      selectors.isMultiViewerMode(state),
    ],
    shallowEqual
  );

  if (
    loadingScreenStyle === LoadingScreenStyles.SKELETON &&
    loadingScreenContext === LoadingScreenContexts.DOCUMENT &&
    isLoadingModalOpen
  ) {
    if (isMultiViewerMode) {
      return null;
    }

    return <LoadingSkeleton />;
  }

  if (isProgressModalOpen) {
    return <ProgressModal />;
  }

  return isLoadingModalOpen ? <LoadingModal /> : null;
};

export default LoadingScreen;
