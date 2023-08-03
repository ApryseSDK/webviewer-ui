import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from 'components/FlyoutMenu/FlyoutMenu';
import PageRotationControls from 'components/PageManipulationOverlay/PageRotationControls';
import DataElements from 'constants/dataElement';

function RotatePopup() {
  const selectedPageIndexes = useSelector((state) => selectors.getSelectedThumbnailPageIndexes(state));

  return (
    <FlyoutMenu
      menu={DataElements.THUMBNAILS_CONTROL_ROTATE_POPUP}
      trigger={DataElements.THUMBNAILS_CONTROL_ROTATE_POPUP_TRIGGER}
    >
      <PageRotationControls
        pageNumbers={selectedPageIndexes.map((i) => i + 1)}
        warn
      />
    </FlyoutMenu>
  );
}

export default RotatePopup;