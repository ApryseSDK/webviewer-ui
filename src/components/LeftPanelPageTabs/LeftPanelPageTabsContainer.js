import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import {
  deletePages,
  extractPages,
  noPagesSelectedWarning,
  replace,
  rotateClockwise,
  rotateCounterClockwise,
  movePagesToBottom,
  movePagesToTop
} from 'helpers/pageManipulationFunctions';
import LeftPanelPageTabsSmall from 'src/components/LeftPanelPageTabs/LeftPanelPageTabsSmall/LeftPanelPageTabsSmall';
import LeftPanelPageTabs from 'components/LeftPanelPageTabs/LeftPanelPageTabs/LeftPanelPageTabs';
import { workerTypes } from 'constants/types';
import core from 'src/core';
import LeftPanelPageTabsRotate from 'components/LeftPanelPageTabs/LeftPanelPageTabsRotate/LeftPanelPageTabsRotate';
import LeftPanelPageTabsLarge from './LeftPanelPageTabsLarge/LeftPanelPageTabsLarge';
import DataElements from 'constants/dataElement';
import { panelMinWidth } from 'constants/panel';
import { isMobile as isInMobile } from 'helpers/device';
import getRootNode from 'helpers/getRootNode';

// Values come from the CSS
const WIDTH_MARGINS = 16 + 8 + 16 + 16 + 16 + 16;

function LeftPanelPageTabsContainer({ parentElement }) {
  const dispatch = useDispatch();
  const isMobile = isInMobile();
  const [
    selectedPageIndexes,
    panelWidth,
    deleteModalEnabled,
    multiPageManipulationControlsItems,
    multiPageManipulationControlsSmall,
    multiPageManipulationControlsLarge,
    isDesktopOnlyMode,
  ] = useSelector((state) => [
    selectors.getSelectedThumbnailPageIndexes(state),
    !parentElement || parentElement === 'leftPanel' ? selectors.getLeftPanelWidth(state) : selectors.getPanelWidth(state, parentElement),
    selectors.pageDeletionConfirmationModalEnabled(state),
    selectors.getMultiPageManipulationControlsItems(state),
    selectors.getMultiPageManipulationControlsItemsSmall(state),
    selectors.getMultiPageManipulationControlsItemsLarge(state),
    selectors.isInDesktopOnlyMode(state),
  ]);

  const pageNumbers = selectedPageIndexes.map((index) => index + 1);

  const openInsertPageModal = () => {
    dispatch(actions.closeElement(DataElements.PAGE_MANIPULATION_OVERLAY));
    dispatch(actions.openElement('insertPageModal'));
  };

  const onReplace = () => !noPagesSelectedWarning(pageNumbers, dispatch) && replace(dispatch);
  const onExtractPages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && extractPages(pageNumbers, dispatch);
  const onDeletePages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && deletePages(pageNumbers, dispatch, deleteModalEnabled);
  const onRotateClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateClockwise(pageNumbers);
  const onRotateCounterClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateCounterClockwise(pageNumbers);
  const onInsert = () => !noPagesSelectedWarning(pageNumbers, dispatch) && openInsertPageModal();
  const moveToTop = () => !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToTop(pageNumbers);
  const moveToBottom = () => !noPagesSelectedWarning(pageNumbers, dispatch) && movePagesToBottom(pageNumbers);

  const document = core.getDocument();
  const documentType = document?.type;
  const isXod = documentType === workerTypes.XOD;
  const isOffice = documentType === workerTypes.OFFICE || documentType === workerTypes.LEGACY_OFFICE;

  if (isXod || isOffice || document?.isWebViewerServerDocument()) {
    return (
      <div className={'PageControlContainer root small'}>
        <LeftPanelPageTabsRotate onRotateClockwise={onRotateClockwise} onRotateCounterClockwise={onRotateCounterClockwise} />
      </div>
    );
  }

  const smallBreakPoint = 190;
  const largeBreakPoint = 290;
  let widthMinusMargins;
  if (!isDesktopOnlyMode && isMobile) {
    try {
      const appRect = getRootNode().querySelector('.App').getBoundingClientRect();
      widthMinusMargins = appRect.width - WIDTH_MARGINS;
    } catch (e) {
      widthMinusMargins = (panelWidth || panelMinWidth) - WIDTH_MARGINS;
    }
  } else {
    widthMinusMargins = (panelWidth || panelMinWidth) - WIDTH_MARGINS;
  }
  const isPanelSmall = widthMinusMargins < smallBreakPoint;
  const isPanelLarge = widthMinusMargins > largeBreakPoint;

  const childProps = {
    onReplace,
    onExtractPages,
    onDeletePages,
    onRotateCounterClockwise,
    onRotateClockwise,
    onInsert,
    moveToTop,
    moveToBottom,
    pageNumbers,
  };

  if (isPanelSmall) {
    return <LeftPanelPageTabsSmall
      {...childProps}
      multiPageManipulationControlsItemsSmall={multiPageManipulationControlsSmall}
    />;
  }

  if (isPanelLarge) {
    return <LeftPanelPageTabsLarge
      {...childProps}
      multiPageManipulationControlsItems={multiPageManipulationControlsLarge}
    />;
  }


  return (
    <LeftPanelPageTabs
      {...childProps}
      multiPageManipulationControlsItems={multiPageManipulationControlsItems}
    />
  );
}

export default LeftPanelPageTabsContainer;
