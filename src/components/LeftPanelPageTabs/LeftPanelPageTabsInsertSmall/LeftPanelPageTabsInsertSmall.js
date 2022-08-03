import React from 'react';

import ToggleElementButton from "components/ToggleElementButton";
import "../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss";

function LeftPanelPageTabsInsertSmall() {
  return (
    <div className={"dropdown-menu"}>
      <ToggleElementButton
        title="action.insertPage"
        className={"dropdown-menu"}
        element="thumbnailsControlInsertPopup"
        dataElement="thumbnailsControlInsertPopupTrigger"
        img="icon-header-page-manipulation-insert-above"
      />
      <div className={"indicator"} />
    </div>
  );
}

export default LeftPanelPageTabsInsertSmall;
