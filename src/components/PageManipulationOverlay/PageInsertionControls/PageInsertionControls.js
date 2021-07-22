import React from 'react';
import { useTranslation } from 'react-i18next'
import DataElementWrapper from 'components/DataElementWrapper';
import Button from 'components/Button';

function PageInsertionControls() {
  const { t } = useTranslation();

  return (
    <>
      <DataElementWrapper
        dataElement='pageInsertionHeader'
        className='type'
      >
        {t('action.insertPage')}
      </DataElementWrapper>
      <DataElementWrapper
        className={'row'}
        dataElement='insertPageAbove'
        onClick={() => console.log('insert page above')}
      >
        <Button
          title='action.insertPageAbove'
          img='icon-page-insertion-insert-above'
          role='option'
        />
        <div className='title'>{t('action.insertPageAbove')}</div>
      </DataElementWrapper>
      <DataElementWrapper
        className={'row'}
        dataElement='insertPageBelow'
        onClick={() => console.log('insert page below')}
      >
        <Button
          title='action.insertPageBelow'
          img='icon-page-insertion-insert-below'
          role='option'
        />
        <div className='title'>{t('action.insertPageBelow')}</div>
      </DataElementWrapper>
    </>
  )

};

export default PageInsertionControls;