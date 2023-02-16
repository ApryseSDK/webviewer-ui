import React from 'react';
import Button from 'components/Button';
import '../LeftPanelPageTabs/LeftPanelPageTabsContainer.scss';

function LeftPanelPageTabsInsert({ onInsert }) {
  return (
    <>
      <Button
        className={'button-hover'}
        dataElement="thumbnailsControlInsert"
        img="icon-page-insertion-insert"
        onClick={onInsert}
        title="action.insert"
      />
    </>
  );
}

export default LeftPanelPageTabsInsert;
