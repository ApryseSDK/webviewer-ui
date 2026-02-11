import React from 'react';
import InsertPageModal from './InsertPageModal';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import useCore from 'hooks/useCore';

const InsertPageModalContainer = () => {
  const { core } = useCore();
  const [isDisabled, isOpen] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.INSERT_PAGE_MODAL),
    selectors.isElementOpen(state, DataElements.INSERT_PAGE_MODAL),
  ]);


  if (!isDisabled && isOpen) {
    const document = core.getDocumentViewer().getDocument();
    const loadedDocumentPageCount = document ? core.getTotalPages() : null;
    return <InsertPageModal loadedDocumentPageCount={loadedDocumentPageCount} />;
  }
  return null;
};
export default InsertPageModalContainer;