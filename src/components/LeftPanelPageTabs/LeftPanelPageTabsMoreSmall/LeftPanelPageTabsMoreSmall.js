import React from 'react';
import ToggleElementButton from "components/ToggleElementButton";
import "../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss";

function LeftPanelPageTabsMoreSmall() {
  return (
    <div className={"dropdown-menu button-hover"}>
      <ToggleElementButton
        title="action.more"
        className={"dropdown-menu"}
        element="thumbnailsControlManipulatePopupSmall"
        dataElement="thumbnailsControlManipulatePopupSmallTrigger"
        img="icon-tool-more"
      />
      <div className={"indicator"} />
    </div>
  );
}

export default LeftPanelPageTabsMoreSmall;
