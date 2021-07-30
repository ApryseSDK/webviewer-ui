import React from 'react';
import { useTranslation } from 'react-i18next'
import DataElementWrapper from 'components/DataElementWrapper';
import Button from 'components/Button';

function PageInsertionControls(props) {
  const { t } = useTranslation();
  const { insertAbove, insertBelow } = props;

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
        onClick={insertAbove}
      >
        <Button
          title='action.insertPageAbove'
          img='icon-page-insertion-insert-above'
          role='option'
        />
        <div className='title'>{t('action.insertBlankPageAbove')}</div>
      </DataElementWrapper>
      <DataElementWrapper 
        className={'row'}
        dataElement='insertPageBelow'
        onClick={insertBelow}
      >
        <Button
          title='action.insertPageBelow'
          img='icon-page-insertion-insert-below'
          role='option'
        />
        <div className='title'>{t('action.insertBlankPageBelow')}</div>
      </DataElementWrapper>
    </>
  )

};

export default PageInsertionControls;