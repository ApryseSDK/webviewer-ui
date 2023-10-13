import React from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import Button from 'components/Button';


function PageRotationControls(props) {
  const { t } = useTranslation();
  const { rotateClockwise, rotateCounterClockwise } = props;


  return (
    <>
      <DataElementWrapper
        dataElement="pageRotationHeader"
        className="type"
      >
        {t('action.rotate')}
      </DataElementWrapper>
      <DataElementWrapper
        dataElement="rotatePageClockwise"
        className="row"
        onClick={rotateClockwise}
      >
        <Button
          title="option.thumbnailPanel.rotatePageClockwise"
          img="icon-header-page-manipulation-page-rotation-clockwise-line"
          role="option"
        />
        <div className="title">{t('option.thumbnailPanel.rotateClockwise')}</div>
      </DataElementWrapper>
      <DataElementWrapper
        dataElement="rotatePageCounterClockwise"
        className="row"
        onClick={rotateCounterClockwise}
      >
        <Button
          title="option.thumbnailPanel.rotatePageCounterClockwise"
          img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
          role="option"
        />
        <div className="title">{t('option.thumbnailPanel.rotateCounterClockwise')}</div>
      </DataElementWrapper>
    </>
  );
}

export default PageRotationControls;