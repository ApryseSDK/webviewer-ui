import React from 'react';
import Button from 'components/Button';
import '../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss';

function LeftPanelPageTabsRotate({ onRotateClockwise, onRotateCounterClockwise }) {
  return (
    <>
      <Button
        className={'button-hover'}
        dataElement="thumbnailsControlRotateCounterClockwise"
        img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
        onClick={onRotateCounterClockwise}
        title="action.rotateCounterClockwise"
      />
      <Button
        className={'button-hover'}
        dataElement="thumbnailsControlRotateClockwise"
        img="icon-header-page-manipulation-page-rotation-clockwise-line"
        onClick={onRotateClockwise}
        title="action.rotateClockwise"
      />
    </>
  );
}

export default LeftPanelPageTabsRotate;
