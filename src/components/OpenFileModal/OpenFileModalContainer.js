import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import OpenFileModal from "components/OpenFileModal/FileModal/OpenFileModal";

const OpenFileModalContainer = () => {
  const [isDisabled, isOpen, tabManager] = useSelector(state => [
    selectors.isElementDisabled(state, 'OpenFileModal'),
    selectors.isElementOpen(state, 'OpenFileModal'),
    selectors.getTabManager(state),
  ]);

  if (isDisabled) {
    return null;
  }

  return <OpenFileModal isOpen={isOpen} tabManager={tabManager} />;
};

export default OpenFileModalContainer;