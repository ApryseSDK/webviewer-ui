import React from 'react';
import RotatePopup from "components/LeftPanelOverlay/RotatePopup";
import InsertPopup from "components/LeftPanelOverlay/InsertPopup";
import MoreOptionsPopup from "components/LeftPanelOverlay/MoreOptionsPopup";

function LeftPanelOverlayContainer() {
  return (
    <>
      <RotatePopup />
      <InsertPopup />
      <MoreOptionsPopup />
    </>
  );
}

export default LeftPanelOverlayContainer;