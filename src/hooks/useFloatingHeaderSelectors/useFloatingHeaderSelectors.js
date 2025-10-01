import { useSelector } from 'react-redux';
import selectors from 'selectors';

const useFloatingHeaderSelectors = () => {
  return useSelector((state) => ({
    isLeftPanelOpen: selectors.isLeftPanelOpen(state),
    isRightPanelOpen: selectors.isRightPanelOpen(state),
    leftPanelWidth: selectors.getDocumentContainerLeftMargin(state),
    rightPanelWidth: selectors.getOpenRightPanelWidth(state),
    leftHeaderWidth: selectors.getActiveLeftHeaderWidth(state),
    rightHeaderWidth: selectors.getActiveRightHeaderWidth(state),
    topHeadersHeight: selectors.getTopHeadersHeight(state),
    bottomHeadersHeight: selectors.getBottomHeadersHeight(state),
    topFloatingContainerHeight: selectors.getTopFloatingContainerHeight(state),
    bottomFloatingContainerHeight: selectors.getBottomFloatingContainerHeight(state),
    topStartFloatingHeaders: selectors.getTopStartFloatingHeaders(state),
    bottomStartFloatingHeaders: selectors.getBottomStartFloatingHeaders(state),
    bottomEndFloatingHeaders: selectors.getBottomEndFloatingHeaders(state),
    topEndFloatingHeaders: selectors.getTopEndFloatingHeaders(state),
    bottomHeadersWidth: selectors.getBottomHeadersWidth(state),
  }));
};

export default useFloatingHeaderSelectors;