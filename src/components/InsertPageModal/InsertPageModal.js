import React, { useCallback } from 'react';
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

import InsertBlankPagePanel from './InsertBlankPagePanel';
import InsertUploadedPagePanel from './InsertUploadedPagePanel';

import './InsertPageModal.scss';

const InsertPageModal = () => {
  const [isDisabled, isOpen] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.INSERT_PAGE_MODAL),
    selectors.isElementOpen(state, DataElements.INSERT_PAGE_MODAL),
  ]);

  const documentViewer = core.getDocumentViewer(1);

  const dispatch = useDispatch();
  const [t] = useTranslation();

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.INSERT_PAGE_MODAL));
  };

  const apply = () => {
    closeModal();
  };

  const getPageCount = useCallback(() => {
    return documentViewer?.getPageCount();
  });

  const modalClass = classNames({
    Modal: true,
    InsertPageModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <FocusTrap locked={isOpen}>
        <div className={modalClass} data-element={DataElements.INSERT_PAGE_MODAL} onClick={closeModal}>
          <div className="container tabs" onClick={(e) => e.stopPropagation()}>
            <div className="swipe-indicator" />
            <Tabs className="insert-page-tabs" id="insertPageModal">
              <div className="header-container">
                <div className="header">
                  <p>{t('insertPageModal.title')}</p>
                  <Button className="insertPageModalCloseButton" img="icon-close" onClick={closeModal} title="action.cancel" />
                </div>
                <div className="tab-list">
                  <Tab dataElement="insertBlankPagePanelButton">
                    <button className="tab-options-button">{t('insertPageModal.tabs.blank')}</button>
                  </Tab>
                  <div className="tab-options-divider" />
                  <Tab dataElement="insertUploadedPagePanelButton">
                    <button className="tab-options-button">{t('insertPageModal.tabs.upload')}</button>
                  </Tab>
                </div>
              </div>
              <div className="divider"></div>
              <TabPanel dataElement="insertBlankPagePanel">
                <InsertBlankPagePanel getPageCount={getPageCount} />
              </TabPanel>
              <TabPanel dataElement="insertUploadedPagePanel">
                <InsertUploadedPagePanel />
              </TabPanel>
            </Tabs>
            <div className="divider"></div>
            <div className="footer">
              <Button className="insertPageModalConfirmButton" label="insertPageModal.button" onClick={apply} />
            </div>
          </div>
        </div>
      </FocusTrap>
    </Swipeable>
  );
};

export default InsertPageModal;
