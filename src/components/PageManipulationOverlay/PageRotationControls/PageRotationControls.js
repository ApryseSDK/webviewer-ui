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
          title="action.rotateClockwise"
          img="icon-header-page-manipulation-page-rotation-clockwise-line"
          role="option"
        />
        <div className="title">{t('action.rotateClockwise')}</div>
      </DataElementWrapper>
      <DataElementWrapper
        dataElement="rotatePageCounterClockwise"
        className="row"
        onClick={rotateCounterClockwise}
      >
        <Button
          title="action.rotateCounterClockwise"
          img="icon-header-page-manipulation-page-rotation-counterclockwise-line"
          role="option"
        />
        <div className="title">{t('action.rotateCounterClockwise')}</div>
      </DataElementWrapper>
    </>
  );
}

export default PageRotationControls;