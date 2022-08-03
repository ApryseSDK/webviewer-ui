import React from 'react';
import Button from "components/Button";
import "../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss";

function LeftPanelPageTabsMove({ moveToTop, moveToBottom }) {
  return (
    <>
      <Button
        className={"button-hover"}
        dataElement="moveToTop"
        img="icon-page-move-up"
        onClick={moveToTop}
        title="action.moveToTop"
      />
      <Button
        className={"button-hover"}
        dataElement="moveToBottom"
        img="icon-page-move-down"
        onClick={moveToBottom}
        title="action.moveToBottom"
      />
    </>
  );
}

export default LeftPanelPageTabsMove;
