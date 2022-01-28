import React from 'react';
import { useSelector } from "react-redux";
import selectors from 'selectors';
import FlyoutMenu from "components/FlyoutMenu/FlyoutMenu";
import PageAdditionalControls from "components/PageManipulationOverlay/PageAdditionalControls";

function MoreOptionsPopup() {
  const selectedPageIndexes = useSelector(state => selectors.getSelectedThumbnailPageIndexes(state));

  return (
    <FlyoutMenu menu="thumbnailsControlManipulatePopup" trigger="thumbnailsControlManipulatePopupTrigger" onClose={undefined}>
      <PageAdditionalControls pageNumbers={selectedPageIndexes.map(i => i + 1)} warn />
    </FlyoutMenu>
  );
}

export default MoreOptionsPopup;