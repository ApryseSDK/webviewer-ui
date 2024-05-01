import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from 'components/FlyoutMenu/FlyoutMenu';
import PageAdditionalControls from 'components/PageManipulationOverlay/PageAdditionalControls';
import PageManipulationControls from '../PageManipulationOverlay/PageManipulationControls';
import DataElements from 'constants/dataElement';

const ThumbnailMoreOptionsPopupSmall = () => {
  const selectedPageIndexes = useSelector((state) => selectors.getSelectedThumbnailPageIndexes(state));

  return (
    <FlyoutMenu
      menu={DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP_SMALL}
      trigger={DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP_SMALL_TRIGGER}
    >
      <PageAdditionalControls
        pageNumbers={selectedPageIndexes.map((i) => i + 1)}
        warn
      />
      <PageManipulationControls
        pageNumbers={selectedPageIndexes.map((i) => i + 1)}
        warn
      />
    </FlyoutMenu>
  );
};

export default ThumbnailMoreOptionsPopupSmall;
