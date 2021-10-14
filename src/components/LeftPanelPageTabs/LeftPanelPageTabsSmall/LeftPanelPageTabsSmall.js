import React from 'react';

import ToggleElementButton from "components/ToggleElementButton";
import Button from "components/Button";
import "../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss";

function LeftPanelPageTabsSmall({ onReplace, onExtractPages, onDeletePages }) {
  return (
    <div className={`PageControlContainer root small`}>
      <div className={"dropdown-menu button-hover"}>
        <ToggleElementButton
          title="action.rotate"
          element="thumbnailsControlRotatePopup"
          dataElement="thumbnailsControlRotatePopupTrigger"
          img="icon-header-page-manipulation-page-rotation-clockwise-line"
        />
        <div className={"indicator"}/>
      </div>
      <div className={"dropdown-menu"}>
        <ToggleElementButton
          title="action.insertPage"
          className={"dropdown-menu"}
          element="thumbnailsControlInsertPopup"
          dataElement="thumbnailsControlInsertPopupTrigger"
          img="icon-header-page-manipulation-insert-above"
        />
        <div className={"indicator"}/>
      </div>
      {/*<Button*/}
      {/*  className={"button-hover"}*/}
      {/*  dataElement="thumbnailsControlReplace"*/}
      {/*  img="icon-header-page-manipulation-page-transition-reader"*/}
      {/*  onClick={onReplace}*/}
      {/*  title="action.replace"*/}
      {/*/>*/}
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
      <div className={"dropdown-menu button-hover"}>
        <ToggleElementButton
          title="action.more"
          className={"dropdown-menu"}
          element="thumbnailsControlManipulatePopup"
          dataElement="thumbnailsControlManipulatePopupTrigger"
          img="icon-tool-more"
        />
        <div className={"indicator"}/>
      </div>
    </div>
  );
}

export default LeftPanelPageTabsSmall;