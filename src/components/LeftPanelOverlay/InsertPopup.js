import React from 'react';
import { useSelector } from "react-redux";
import selectors from 'selectors';
import FlyoutMenu from "components/FlyoutMenu/FlyoutMenu";
import PageInsertionControls from "components/PageManipulationOverlay/PageInsertionControls";

function InsertPopup() {
  const selectedPageIndexes = useSelector(state => selectors.getSelectedThumbnailPageIndexes(state));

  return (
    <FlyoutMenu menu="thumbnailsControlInsertPopup" trigger="thumbnailsControlInsertPopupTrigger" onClose={undefined}>
      <PageInsertionControls pageNumbers={selectedPageIndexes.map(i => i + 1)} warn/>
    </FlyoutMenu>
  );
}

export default InsertPopup;