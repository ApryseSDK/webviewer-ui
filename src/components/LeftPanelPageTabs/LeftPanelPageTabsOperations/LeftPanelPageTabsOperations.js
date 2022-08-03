import React from 'react';
import Button from "components/Button";
import "../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss";

function LeftPanelPageTabsOperations({ onReplace, onExtractPages, onDeletePages }) {
  return (
    <>
      <Button
        className={"button-hover"}
        dataElement="thumbnailsControlReplace"
        img="icon-page-replacement"
        onClick={onReplace}
        title="action.replace"
      />
      <Button
        className={"button-hover"}
        dataElement="thumbnailsControlExtract"
        img="icon-page-manipulation-extract"
        onClick={onExtractPages}
        title="action.extract"
      />
      <Button
        className={"button-hover"}
        dataElement="thumbnailsControlDelete"
        img="icon-page-manipulation-delete"
        onClick={onDeletePages}
        title="action.delete"
      />
    </>
  );
}

export default LeftPanelPageTabsOperations;
