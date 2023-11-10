import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from 'components/FlyoutMenu/FlyoutMenu';
import DataElements from 'constants/dataElement';
import PageManipulationControls from '../PageManipulationOverlay/PageManipulationControls';

const ThumbnailMoreOptionsPopup = () => {
  const selectedPageIndexes = useSelector((state) => selectors.getSelectedThumbnailPageIndexes(state));

  return (
    <FlyoutMenu
      menu={DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP}
      trigger={DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP_TRIGGER}
    >
      <PageManipulationControls
        pageNumbers={selectedPageIndexes.map((i) => i + 1)}
        warn
      />
    </FlyoutMenu>
  );
};

export default ThumbnailMoreOptionsPopup;
