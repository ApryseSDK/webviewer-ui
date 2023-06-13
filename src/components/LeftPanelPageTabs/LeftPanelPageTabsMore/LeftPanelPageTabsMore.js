import React from 'react';
import ToggleElementButton from 'components/ToggleElementButton';
import '../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss';
import DataElements from 'constants/dataElement';

function LeftPanelPageTabsMore() {
  return (
    <div className={'dropdown-menu button-hover'}>
      <ToggleElementButton
        title="action.more"
        className={'dropdown-menu'}
        element={DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP}
        dataElement={DataElements.THUMBNAILS_CONTROL_MANIPULATE_POPUP_TRIGGER}
        img="icon-tool-more"
      />
      <div className={'indicator'} />
    </div>
  );
}

export default LeftPanelPageTabsMore;
