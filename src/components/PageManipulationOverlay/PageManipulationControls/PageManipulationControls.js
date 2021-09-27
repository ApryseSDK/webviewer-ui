import React from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import Button from 'components/Button';

function PageManipulationControls(props) {
  const { t } = useTranslation();
  const { deletePages, extractPages, replacePages } = props;

  return (
    <>
      <DataElementWrapper
        dataElement="pageManipulationHeader"
        className="type"
      >
        {t('action.pageManipulation')}
      </DataElementWrapper>
      {/*<DataElementWrapper*/}
      {/*  className="row"*/}
      {/*  dataElement="replacePage"*/}
      {/*  onClick={replacePages}*/}
      {/*>*/}
      {/*  <Button*/}
      {/*    title="action.replace"*/}
      {/*    img="icon-page-insertion-insert-below"//we dont have this icon yet, this is a placeholder*/}
      {/*    role="option"*/}
      {/*  />*/}
      {/*  <div className="title">{t('action.replace')}</div>*/}
      {/*</DataElementWrapper>*/}
      <DataElementWrapper
        className="row"
        dataElement="extractPage"
        onClick={extractPages}
      >
        <Button
          title="action.extract"
          img="icon-page-manipulation-extract"
          role="option"
        />
        <div className="title">{t('action.extract')}</div>
      </DataElementWrapper>
      <DataElementWrapper
        dataElement="deletePage"
        className="row"
        onClick={deletePages}
      >
        <Button
          title="action.delete"
          img="icon-page-manipulation-delete"
          role="option"
        />
        <div className="title">{t('action.delete')}</div>
      </DataElementWrapper>
    </>
  );



}


export default PageManipulationControls;