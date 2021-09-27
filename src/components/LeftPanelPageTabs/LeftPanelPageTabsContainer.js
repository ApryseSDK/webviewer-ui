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

function LeftPanelPageTabsContainer() {
  const dispatch = useDispatch();
  const [selectedPageIndexes, leftPanelWidth, deleteModalEnabled] = useSelector(state => [
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.getLeftPanelWidth(state),
    selectors.pageDeletionConfirmationModalEnabled(state),
  ]);

  const pageNumbers = selectedPageIndexes.map(index => index + 1);

  // TODO: Integrate with replace
  const onReplace = () => !noPagesSelectedWarning(pageNumbers, dispatch) && replace();
  const onExtractPages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && extractPages(pageNumbers, dispatch);
  const onDeletePages = () => !noPagesSelectedWarning(pageNumbers, dispatch) && deletePages(pageNumbers, dispatch, deleteModalEnabled);

  // Breakpoint to convert to popups
  const breakPoint = 360;
  const isPanelSmall = leftPanelWidth < breakPoint;

  if (isPanelSmall) {
    return <LeftPanelPageTabsSmall onReplace={onReplace} onExtractPages={onExtractPages} onDeletePages={onDeletePages}/>;
  }

  const onRotateClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateClockwise(pageNumbers);
  const onRotateCounterClockwise = () => !noPagesSelectedWarning(pageNumbers, dispatch) && rotateCounterClockwise(pageNumbers);
  const onInsertAbove = () => !noPagesSelectedWarning(pageNumbers, dispatch) && insertAbove(pageNumbers);
  const onInsertBelow = () => !noPagesSelectedWarning(pageNumbers, dispatch) && insertBelow(pageNumbers);

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
