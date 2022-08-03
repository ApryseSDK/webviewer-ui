import React from 'react';
import Button from "components/Button";
import "../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss";

function LeftPanelPageTabsInsert({ onInsertAbove, onInsertBelow }) {
  return (
    <>
      <Button
        className={"button-hover"}
        dataElement="thumbnailsControlInsertAbove"
        img="icon-header-page-manipulation-insert-above"
        onClick={onInsertAbove}
        title="action.insertBlankPageAbove"
      />
      <Button
        className={"button-hover"}
        dataElement="thumbnailsControlInsertBelow"
        img="icon-header-page-manipulation-insert-below"
        onClick={onInsertBelow}
        title="action.insertBlankPageBelow"
      />
    </>
  );
}

export default LeftPanelPageTabsInsert;
