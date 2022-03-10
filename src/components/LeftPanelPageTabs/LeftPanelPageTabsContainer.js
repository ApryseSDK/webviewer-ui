import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import selectors from 'selectors';
import {
  deletePages,
  extractPages,
  insertAbove,
  insertBelow,
  noPagesSelectedWarning,
  replace,
  rotateClockwise,
  rotateCounterClockwise
} from "helpers/pageManipulationFunctions";
import LeftPanelPageTabsSmall from "components/LeftPanelPageTabs/LeftPanelPageTabsSmall/LeftPanelPageTabsSmall";
import LeftPanelPageTabs from "components/LeftPanelPageTabs/LeftPanelPageTabs/LeftPanelPageTabs";
import { workerTypes } from "constants/types";
import core from "src/core";
import LeftPanelPageTabsRotate from "components/LeftPanelPageTabs/LeftPanelPageTabsRotate/LeftPanelPageTabsRotate";

function LeftPanelPageTabsContainer() {
  const dispatch = useDispatch();
  const [selectedPageIndexes, leftPanelWidth, deleteModalEnabled] = useSelector(state => [
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.getLeftPanelWidth(state),
    selectors.pageDeletionConfirmationModalEnabled(state),
  ]);

  const pageNumbers = selectedPageIndexes.map(index => index + 1);

  const onReplace = () => !noPagesSelectedWarning(pageNumbers, dispatch) && replace(dispatch);
  const onExtractPages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && extractPages(pageNumbers, dispatch);
  const onDeletePages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && deletePages(pageNumbers, dispatch, deleteModalEnabled);
  const onRotateClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateClockwise(pageNumbers);
  const onRotateCounterClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateCounterClockwise(pageNumbers);
  const onInsertAbove = () => !noPagesSelectedWarning(pageNumbers, dispatch) && insertAbove(pageNumbers);
  const onInsertBelow = () => !noPagesSelectedWarning(pageNumbers, dispatch) && insertBelow(pageNumbers);

  const document = core.getDocument();
  const documentType = document?.type;
  const isXod = documentType === workerTypes.XOD;
  const isOffice = documentType === workerTypes.OFFICE || documentType === workerTypes.LEGACY_OFFICE;

  if (isXod || isOffice || document?.isWebViewerServerDocument()) {
    return (
      <LeftPanelPageTabsRotate onRotateClockwise={onRotateClockwise} onRotateCounterClockwise={onRotateCounterClockwise} />
    );
  }
  // Breakpoint to convert to popups
  const breakPoint = 360;
  const isPanelSmall = leftPanelWidth < breakPoint;

  if (isPanelSmall) {
    return <LeftPanelPageTabsSmall onReplace={onReplace} onExtractPages={onExtractPages} onDeletePages={onDeletePages} />;
  }


  return (
    <LeftPanelPageTabs
      onReplace={onReplace}
      onExtractPages={onExtractPages}
      onDeletePages={onDeletePages}
      onRotateCounterClockwise={onRotateCounterClockwise}
      onRotateClockwise={onRotateClockwise}
      onInsertAbove={onInsertAbove}
      onInsertBelow={onInsertBelow}
    />
  );
}

export default LeftPanelPageTabsContainer;
