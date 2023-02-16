import React from 'react';
import RotatePopup from 'components/LeftPanelOverlay/RotatePopup';
import MoreOptionsPopup from 'components/LeftPanelOverlay/MoreOptionsPopup';
import MoreOptionsPopupSmall from 'components/LeftPanelOverlay/MoreOptionsPopupSmall';

function LeftPanelOverlayContainer() {
  return (
    <>
      <RotatePopup />
      <MoreOptionsPopup />
      <MoreOptionsPopupSmall />
    </>
  );
}

export default LeftPanelOverlayContainer;
