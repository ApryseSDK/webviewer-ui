import React from 'react';
import { useSelector } from "react-redux";
import selectors from 'selectors';
import FlyoutMenu from "components/FlyoutMenu/FlyoutMenu";
import PageAdditionalControls from "components/PageManipulationOverlay/PageAdditionalControls";
import PageManipulationControls from '../PageManipulationOverlay/PageManipulationControls';

function MoreOptionsPopupSmall() {
  const selectedPageIndexes = useSelector(state => selectors.getSelectedThumbnailPageIndexes(state));

  return (
    <FlyoutMenu menu="thumbnailsControlManipulatePopupSmall" trigger="thumbnailsControlManipulatePopupSmallTrigger" onClose={undefined}>
      <PageAdditionalControls pageNumbers={selectedPageIndexes.map(i => i + 1)} warn />
      <PageManipulationControls pageNumbers={selectedPageIndexes.map(i => i + 1)} warn />
    </FlyoutMenu>
  );
}

export default MoreOptionsPopupSmall;
