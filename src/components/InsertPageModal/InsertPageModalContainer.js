import React from 'react';
import InsertPageModal from './InsertPageModal';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import core from 'core';

const InsertPageModalContainer = () => {
  const [isDisabled, isOpen] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.INSERT_PAGE_MODAL),
    selectors.isElementOpen(state, DataElements.INSERT_PAGE_MODAL),
  ]);


  if (!isDisabled && isOpen) {
    const loadedDocumentPageCount = core.getTotalPages();
    return (<InsertPageModal loadedDocumentPageCount={loadedDocumentPageCount} />);
  }
  return null;
};
export default InsertPageModalContainer;