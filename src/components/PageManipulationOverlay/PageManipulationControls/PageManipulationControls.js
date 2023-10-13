import React from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import Button from 'components/Button';

function PageManipulationControls(props) {
  const { t } = useTranslation();
  const { deletePages, extractPages, insertPages, replacePages } = props;

  return (
    <>
      <DataElementWrapper
        dataElement="pageManipulationHeader"
        className="type"
      >
        {t('action.pageManipulation')}
      </DataElementWrapper>
      <DataElementWrapper
        className="row"
        dataElement="insertPage"
        onClick={insertPages}
      >
        <Button
          title="action.insertPage"
          img="icon-page-insertion-insert"
          role="option"
          onClickAnnouncement={`${t('action.insertPage')} ${t('action.modal')} ${t('action.isOpen')}`}
        />
        <div className="title">{t('action.insert')}</div>
      </DataElementWrapper>
      <DataElementWrapper
        className="row"
        dataElement="replacePage"
        onClick={replacePages}
      >
        <Button
          title="action.replacePage"
          img="icon-page-replacement"
          role="option"
          onClickAnnouncement={`${t('action.replacePage')} ${t('action.modal')} ${t('action.isOpen')}`}
        />
        <div className="title">{t('action.replace')}</div>
      </DataElementWrapper>
      <DataElementWrapper
        className="row"
        dataElement="extractPage"
        onClick={extractPages}
      >
        <Button
          title="action.extractPage"
          img="icon-page-manipulation-extract"
          role="option"
          onClickAnnouncement={`${t('action.extractPage')} ${t('action.modal')} ${t('action.isOpen')}`}
        />
        <div className="title">{t('action.extract')}</div>
      </DataElementWrapper>
      <DataElementWrapper
        dataElement="deletePage"
        className="row"
        onClick={deletePages}
      >
        <Button
          title="option.thumbnailPanel.delete"
          img="icon-delete-line"
          role="option"
          onClickAnnouncement={`${t('action.delete')} ${t('action.modal')} ${t('action.isOpen')}`}
        />
        <div className="title">{t('action.delete')}</div>
      </DataElementWrapper>
    </>
  );
}


export default PageManipulationControls;
