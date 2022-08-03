import React from 'react';
import RotatePopup from "components/LeftPanelOverlay/RotatePopup";
import InsertPopup from "components/LeftPanelOverlay/InsertPopup";
import MoreOptionsPopup from "components/LeftPanelOverlay/MoreOptionsPopup";
import MoreOptionsPopupSmall from "components/LeftPanelOverlay/MoreOptionsPopupSmall";

function LeftPanelOverlayContainer() {
  return (
    <>
      <RotatePopup />
      <InsertPopup />
      <MoreOptionsPopup />
      <MoreOptionsPopupSmall />
    </>
  );
}

export default LeftPanelOverlayContainer;
