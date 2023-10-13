import React from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import Button from 'components/Button';

function PageAdditionalControls(props) {
  const { t } = useTranslation();
  const { moveToTop, moveToBottom } = props;

  return (
    <>
      <DataElementWrapper
        dataElement="pageAdditionalControlsHeader"
        className="type"
        aria-label="presentation"
      >
        {t('option.thumbnailsControlOverlay.move')}
      </DataElementWrapper>
      <DataElementWrapper
        className="row"
        dataElement="moveToTop"
        onClick={moveToTop}
      >
        <Button
          title="action.movePageToTop"
          img="icon-page-move-up"
          role="option"
          onClick={moveToTop}
        />
        <div className="title" >{t('action.moveToTop')}</div>
      </DataElementWrapper>
      <DataElementWrapper
        className="row"
        dataElement="moveToBottom"
        onClick={moveToBottom}
      >
        <Button
          title="action.movePageToBottom"
          img="icon-page-move-down"
          role="option"
          onClick={moveToBottom}
        />
        <div className="title">{t('action.moveToBottom')}</div>
      </DataElementWrapper>
    </>
  );
}

export default PageAdditionalControls;