import displayModeObjects from 'constants/displayModeObjects';
import core from 'core';
import { useLayoutEffect } from 'react';
import { useSelector, useStore, useDispatch } from 'react-redux';
import selectors from 'selectors';
import { enterReaderMode, exitReaderMode } from 'helpers/readerMode';
import actions from 'actions';
import toggleFullscreen from 'helpers/toggleFullscreen';
import { isIE11, isIOS, isIOSFullScreenSupported } from 'helpers/device';
import DataElements from 'constants/dataElement';

const ViewControlsFlyout = () => {
  const store = useStore();
  const dispatch = useDispatch();

  const totalPages = useSelector(selectors.getTotalPages);
  const displayMode = useSelector(selectors.getDisplayMode);
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.VIEW_CONTROLS_FLYOUT));
  const isReaderMode = useSelector(selectors.isReaderMode);
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const isFullScreen = useSelector(selectors.isFullScreen);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const isMultiTab = useSelector((state) => selectors.getIsMultiTab(state));
  const isMultiViewerModeAvailable = useSelector(selectors.getIsMultiViewerModeAvailable);
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, DataElements.VIEW_CONTROLS_FLYOUT));

  const totalPageThreshold = 1000;
  let isPageTransitionEnabled = totalPages < totalPageThreshold;

  const documentViewer = core.getDocumentViewer();
  const displayModeManager = documentViewer?.getDisplayModeManager();
  if (displayModeManager?.isVirtualDisplayEnabled()) {
    isPageTransitionEnabled = true;
  }

  const showReaderButton = core.isFullPDFEnabled() && core.getDocument()?.getType() === 'pdf';
  const showCompareButton = !isIE11 && !isMultiTab && isMultiViewerModeAvailable;
  const toggleCompareMode = () => {
    store.dispatch(actions.setIsMultiViewerMode(!isMultiViewerMode));
  };

  const handleClick = (pageTransition, layout) => {
    const setDisplayMode = () => {
      const displayModeObject = displayModeObjects.find(
        (obj) => obj.pageTransition === pageTransition && obj.layout === layout,
      );
      core.setDisplayMode(displayModeObject.displayMode);
    };

    if (isReaderMode) {
      exitReaderMode(store);
      setTimeout(() => {
        setDisplayMode();
      });
    } else {
      setDisplayMode();
    }
  };

  const handleReaderModeClick = () => {
    if (isReaderMode) {
      return;
    }
    enterReaderMode(store);
    dispatch(actions.closeElement(DataElements.VIEW_CONTROLS_FLYOUT));
  };

  let pageTransition;
  let layout;

  const displayModeObject = displayModeObjects.find((obj) => obj.displayMode === displayMode);
  if (displayModeObject) {
    pageTransition = displayModeObject.pageTransition;
    layout = displayModeObject.layout;
  }

  const getViewControlsFlyoutItems = () => {
    let viewControlsFlyoutItems = [];

    const continuousPageTransitionButton = {
      icon: 'icon-header-page-manipulation-page-transition-continuous-page-line',
      label: 'option.pageTransition.continuous',
      title: 'option.pageTransition.continuous',
      onClick: () => handleClick('continuous', layout),
      dataElement: 'continuousPageTransitionButton',
      isActive: pageTransition === 'continuous' && !isReaderMode
    };
    const defaultPageTransitionButton = {
      icon: 'icon-header-page-manipulation-page-transition-page-by-page-line',
      label: 'option.pageTransition.default',
      title: 'option.pageTransition.default',
      onClick: () => handleClick('default', layout),
      dataElement: 'defaultPageTransitionButton',
      isActive: pageTransition === 'default' && !isReaderMode
    };
    const readerPageTransitionButton = {
      icon: 'icon-header-page-manipulation-page-transition-reader',
      label: 'option.pageTransition.reader',
      title: 'option.pageTransition.reader',
      onClick: () => handleReaderModeClick(),
      dataElement: 'readerPageTransitionButton',
      isActive: isReaderMode
    };
    const rotateClockwiseButton = {
      icon: 'icon-header-page-manipulation-page-rotation-clockwise-line',
      label: 'action.rotateClockwise',
      title: 'action.rotateClockwise',
      onClick: () => core.rotateClockwise(activeDocumentViewerKey),
      dataElement: 'rotateClockwiseButton'
    };
    const rotateCounterClockwiseButton = {
      icon: 'icon-header-page-manipulation-page-rotation-counterclockwise-line',
      label: 'action.rotateCounterClockwise',
      title: 'action.rotateCounterClockwise',
      onClick: () => core.rotateCounterClockwise(activeDocumentViewerKey),
      dataElement: 'rotateCounterClockwiseButton'
    };
    const singleLayoutButton = {
      icon: 'icon-header-page-manipulation-page-layout-single-page-line',
      label: 'option.layout.single',
      title: 'option.layout.single',
      onClick: () => handleClick(pageTransition, 'single'),
      dataElement: 'singleLayoutButton',
      isActive: layout === 'single'
    };
    const doubleLayoutButton = {
      icon: 'icon-header-page-manipulation-page-layout-double-page-line',
      label: 'option.layout.double',
      title: 'option.layout.double',
      onClick: () => handleClick(pageTransition, 'double'),
      dataElement: 'doubleLayoutButton',
      isActive: layout === 'double'
    };
    const coverLayoutButton = {
      icon: 'icon-header-page-manipulation-page-layout-cover-line',
      label: 'option.layout.cover',
      title: 'option.layout.cover',
      onClick: () => handleClick(pageTransition, 'cover'),
      dataElement: 'coverLayoutButton',
      isActive: layout === 'cover'
    };

    const divider = 'divider';

    if (isPageTransitionEnabled) {
      viewControlsFlyoutItems.push('option.displayMode.pageTransition');
      viewControlsFlyoutItems = [...viewControlsFlyoutItems, continuousPageTransitionButton, defaultPageTransitionButton];

      if (showReaderButton) {
        viewControlsFlyoutItems.push(readerPageTransitionButton);
      }
      if (!isReaderMode) {
        viewControlsFlyoutItems.push(divider);
      }
    }
    if (!isReaderMode) {
      viewControlsFlyoutItems = [...viewControlsFlyoutItems,
        'action.rotate',
        rotateClockwiseButton,
        rotateCounterClockwiseButton,
        divider,
        'option.displayMode.layout',
        singleLayoutButton,
        doubleLayoutButton,
        coverLayoutButton
      ];
    }
    if (showCompareButton) {
      const toggleCompareModeButton = {
        icon: 'icon-header-compare',
        label: 'action.comparePages',
        title: 'action.comparePages',
        onClick: toggleCompareMode,
        dataElement: 'toggleCompareModeButton',
        isActive: isMultiViewerMode
      };
      viewControlsFlyoutItems.push(toggleCompareModeButton);
    }

    if (!isIOS || isIOSFullScreenSupported) {
      const fullScreenButton = {
        icon: isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen',
        label: isFullScreen ? 'action.exitFullscreen' : 'action.enterFullscreen',
        title: isFullScreen ? 'action.exitFullscreen' : 'action.enterFullscreen',
        onClick: toggleFullscreen,
        dataElement: DataElements.FULLSCREEN_BUTTON
      };
      viewControlsFlyoutItems.push(divider);
      viewControlsFlyoutItems.push(fullScreenButton);
    }

    return viewControlsFlyoutItems;
  };

  useLayoutEffect(() => {
    const viewControlsFlyout = {
      dataElement: DataElements.VIEW_CONTROLS_FLYOUT,
      className: 'ViewControlsFlyout',
      items: getViewControlsFlyoutItems()
    };

    if (!currentFlyout) {
      dispatch(actions.addFlyout(viewControlsFlyout));
    } else {
      dispatch(actions.updateFlyout(viewControlsFlyout.dataElement, viewControlsFlyout));
    }
  }, [isFullScreen, isMultiViewerModeAvailable, isMultiViewerMode, displayMode, isReaderMode]);

  if (isDisabled) {
    return;
  }

  return null;
};

export default ViewControlsFlyout;
