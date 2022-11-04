import React from 'react';
import ToggleElementButton from 'components/ToggleElementButton';
import '../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss';

function LeftPanelPageTabsMore() {
  return (
    <div className={'dropdown-menu button-hover'}>
      <ToggleElementButton
        title="action.more"
        className={'dropdown-menu'}
        element="thumbnailsControlManipulatePopup"
        dataElement="thumbnailsControlManipulatePopupTrigger"
        img="icon-tool-more"
      />
      <div className={'indicator'} />
    </div>
  );
}

export default LeftPanelPageTabsMore;
