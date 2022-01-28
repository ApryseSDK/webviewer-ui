import React from 'react';

import ToggleElementButton from "components/ToggleElementButton";
import Button from "components/Button";

function LeftPanelPageTabs({ onRotateClockwise, onRotateCounterClockwise, onInsertAbove, onInsertBelow, onReplace, onExtractPages, onDeletePages }) {
  return (
    <div className={`PageControlContainer root`}>
      <Button
        className={"button-hover"}
        dataElement="thumbnailsControlRotateClockwise"
        img="icon-header-page-manipulation-page-rotation-clockwise-line"
        onClick={onRotateClockwise}
        title="action.rotateClockwise"
      />
      <Button
        className={"button-hover"}
        dataElement="thumbnailsControlRotateCounterClockwise"
        img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
        onClick={onRotateCounterClockwise}
        title="action.rotateCounterClockwise"
      />
      <div className={'divider'}/>
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
      <div className={'divider'}/>
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
      <div className={'divider'}/>
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

export default LeftPanelPageTabs;