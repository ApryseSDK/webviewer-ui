import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import Button from 'components/Button';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import { Swipeable } from 'react-swipeable';

import core from 'core';

import { insertAbove, insertBelow, exitPageInsertionWarning } from '../../helpers/pageManipulationFunctions';
import InsertBlankPagePanel from './InsertBlankPagePanel';
import InsertUploadedPagePanel from './InsertUploadedPagePanel';

import './InsertPageModal.scss';
import FilePickerPanel from '../PageReplacementModal/FilePickerPanel';

const options = { loadAsPDF: true, l: window.sampleL /* license key here */ };

const InsertPageModal = ({ loadedDocumentPageCount }) => {
  const [selectedPageIndexes, currentPage, selectedTab] = useSelector((state) => [
    selectors.getSelectedThumbnailPageIndexes(state),
    selectors.getCurrentPage(state),
    selectors.getSelectedTab(state, DataElements.INSERT_PAGE_MODAL),
  ]);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const fileInputId = 'insertPageFileInputId';
  const [insertNewPageBelow, setInsertNewPageBelow] = useState(false);
  const [insertNewPageIndexes, setInsertNewPageIndexes] = useState([]);
  const [numberOfBlankPagesToInsert, setNumberOfBlankPagesToInsert] = useState(1);
  const [insertPageHeight, setInsertPageHeight] = useState(0);
  const [insertPageWidth, setInsertPageWidth] = useState(0);

  useEffect(() => {
    const pageNumbers = selectedPageIndexes.length > 0 ? selectedPageIndexes.map((i) => i + 1) : [currentPage];
    setInsertNewPageIndexes(pageNumbers);
  }, [selectedPageIndexes]);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.INSERT_PAGE_MODAL));
  };

  const showCloseModalWarning = () => {
    exitPageInsertionWarning(closeModal, dispatch);
  };

  const apply = () => {
    if (insertNewPageBelow) {
      for (let i = 0; i < numberOfBlankPagesToInsert; ++i) {
        insertBelow(insertNewPageIndexes.map((page, index) => page + (index + 1) * i), insertPageWidth, insertPageHeight);
      }
    } else {
      for (let i = 0; i < numberOfBlankPagesToInsert; ++i) {
        insertAbove(insertNewPageIndexes.map((page, index) => page + (index + 1) * i), insertPageWidth, insertPageHeight);
      }
    }
    closeModal();
  };

  // File picker can merge docs, in which case the callback gets
  // executed with a Document not a file
  const fileProcessedHandler = async (file) => {
    let document;
    // eslint-disable-next-line no-undef
    if (file instanceof instance.Core.Document) {
      document = file;
    } else {
      try {
        document = await core.createDocument(file, options);
      } catch (e) {
        console.error('File type not supported');
      }
    }
    setSelectedDoc(document);
  };

  const clearDocument = () => {
    setSelectedDoc(null);
  };

  const renderFileSelectedPanel = () => {
    return (
      <InsertUploadedPagePanel
        sourceDocument={selectedDoc}
        closeModal={closeModal}
        clearLoadedFile={clearDocument}
        loadedDocumentPageCount={loadedDocumentPageCount}
        insertNewPageIndexes={insertNewPageIndexes}
      />
    );
  };

  const modalClass = classNames({
    Modal: true,
    InsertPageModal: true,
    open: true,
  });

  const renderSelectionTabs = () => {
    const isUploadPagePanelActive = selectedTab === DataElements.INSERT_FROM_FILE_TAB;
    const insertBlankPageProps = {
      insertNewPageBelow,
      insertNewPageIndexes,
      numberOfBlankPagesToInsert,
      setInsertNewPageBelow,
      setInsertNewPageIndexes,
      setNumberOfBlankPagesToInsert,
      setInsertPageHeight,
      setInsertPageWidth,
      loadedDocumentPageCount,
    };
    return (
      <div className="container tabs" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        <div className="swipe-indicator" />
        <Tabs className="insert-page-tabs" id={DataElements.INSERT_PAGE_MODAL}>
          <div className="header-container">
            <div className="header">
              <p>{t('insertPageModal.title')}</p>
              <Button className="insertPageModalCloseButton" img="icon-close" onClick={closeModal} title="action.close" />
            </div>
            <div className="tab-list">
              <Tab dataElement={DataElements.INSERT_BLANK_PAGE_TAB}>
                <button className="tab-options-button">{t('insertPageModal.tabs.blank')}</button>
              </Tab>
              <div className="tab-options-divider" />
              <Tab dataElement={DataElements.INSERT_FROM_FILE_TAB}>
                <button className="tab-options-button">{t('insertPageModal.tabs.upload')}</button>
              </Tab>
            </div>
          </div>
          <div className="divider"></div>
          <TabPanel dataElement={DataElements.INSERT_BLANK_PAGE_PANEL}>
            <InsertBlankPagePanel {...insertBlankPageProps} />
          </TabPanel>
          <TabPanel dataElement={DataElements.INSERT_FROM_FILE_PANEL}>
            <div className='panel-body'>
              <FilePickerPanel
                fileInputId={fileInputId}
                onFileProcessed={(file) => fileProcessedHandler(file)} />
            </div>
          </TabPanel>
        </Tabs>
        <div className="divider"></div>
        <div className="footer">
          <Button
            className="insertPageModalConfirmButton"
            label="insertPageModal.button"
            onClick={apply}
            disabled={insertPageWidth <= 0 || insertPageHeight <= 0 || isUploadPagePanelActive || insertNewPageIndexes.length === 0} />
        </div>
      </div>
    );
  };

  return (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <div className={modalClass} data-element={DataElements.INSERT_PAGE_MODAL} onMouseDown={selectedDoc ? showCloseModalWarning : closeModal}>
        <FocusTrap locked={true}>
          {selectedDoc ? renderFileSelectedPanel() : renderSelectionTabs()}
        </FocusTrap>
      </div>
    </Swipeable>
  );
};

export default InsertPageModal;
