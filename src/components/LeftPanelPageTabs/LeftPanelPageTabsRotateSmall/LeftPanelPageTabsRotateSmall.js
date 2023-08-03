import React from 'react';
import ToggleElementButton from 'components/ToggleElementButton';
import '../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss';
import DataElements from 'constants/dataElement';

function LeftPanelPageTabsRotateSmall() {
  return (
    <div className={'dropdown-menu button-hover'}>
      <ToggleElementButton
        title="action.rotate"
        element={DataElements.THUMBNAILS_CONTROL_ROTATE_POPUP}
        dataElement={DataElements.THUMBNAILS_CONTROL_ROTATE_POPUP_TRIGGER}
        img="icon-header-page-manipulation-page-rotation-clockwise-line"
      />
      <div className={'indicator'} />
    </div>
  );
}

export default LeftPanelPageTabsRotateSmall;
