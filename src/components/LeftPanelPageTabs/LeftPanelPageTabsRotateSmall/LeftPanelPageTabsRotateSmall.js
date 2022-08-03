import React from 'react';
import ToggleElementButton from "components/ToggleElementButton";
import "../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss";

function LeftPanelPageTabsRotateSmall() {
  return (
    <div className={"dropdown-menu button-hover"}>
      <ToggleElementButton
        title="action.rotate"
        element="thumbnailsControlRotatePopup"
        dataElement="thumbnailsControlRotatePopupTrigger"
        img="icon-header-page-manipulation-page-rotation-clockwise-line"
      />
      <div className={"indicator"} />
    </div>
  );
}

export default LeftPanelPageTabsRotateSmall;
