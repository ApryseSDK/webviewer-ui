import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import actions from 'actions';
import classNames from 'classnames';
import DataElements from 'constants/dataElement';
import Button from 'components/Button';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import FilePicker from 'components/FilePicker';
import Icon from 'components/Icon';
import AddItemPopup from './AddItemPopup';
import PortfolioItemGrid from './PortfolioItemGrid';
import { createPortfolio } from 'helpers/portfolio';
import loadDocument from 'helpers/loadDocument';

import './CreatePortfolioModal.scss';

const CreatePortfolioModal = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [
    isDisabled,
    isOpen,
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.CREATE_PORTFOLIO_MODAL),
    selectors.isElementOpen(state, DataElements.CREATE_PORTFOLIO_MODAL),
  ]);

  const [items, setItems] = useState([]);
  const [isAddPopupActive, setIsAddPopupActive] = useState(false);

  const fileInputRef = useRef(null);

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.CREATE_PORTFOLIO_MODAL));
  };

  const onFilesSelected = (files) => {
    setItems(files);
  };

  const create = async () => {
    const pdfDoc = await createPortfolio(items);
    loadDocument(dispatch, pdfDoc);
    closeModal();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setItems(items.concat(Array.from(files)));
    }
  };

  const toggleAddItemOption = () => {
    setIsAddPopupActive(!isAddPopupActive);
  };

  const closePopup = () => {
    setIsAddPopupActive(false);
  };

  const addFiles = () => {
    fileInputRef?.current?.click();
  };

  const addFolder = () => {
  };

  const deleteItem = (index) => {
    items.splice(index, 1);
    setItems([...items]);
  };

  const modalClass = classNames({
    'CreatePortfolioModal': true,
    'is-editing': items.length > 0
  });

  const addItemOptionClass = classNames({
    'add-item-option': true,
    'show-popup': isAddPopupActive
  });

  return (isDisabled || !isOpen) ? null : (
    <div className={modalClass} data-element={DataElements.CREATE_PORTFOLIO_MODAL} onClick={closeModal}>
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <div>{t('portfolio.createPDFPortfolio')}</div>
          <Button
            img="icon-close"
            onClick={closeModal}
            title="action.close"
          />
        </div>
        {(items.length === 0) && (
          <Tabs id={DataElements.CREATE_PORTFOLIO_MODAL}>
            <div className="tab-list">
              <Tab dataElement={DataElements.PORTFOLIO_UPLOAD_FILES_TAB}>
                <button className="tab-options-button">
                  {t('portfolio.uploadFiles')}
                </button>
              </Tab>
              <div className="tab-options-divider" />
              <Tab dataElement={DataElements.PORTFOLIO_UPLOAD_FOLDER_TAB}>
                <button className="tab-options-button">
                  {t('portfolio.uploadFolder')}
                </button>
              </Tab>
            </div>
            <div className="divider"></div>
            <div className="tab-panels">
              <TabPanel dataElement="portfolioUploadFiles">
                <FilePicker
                  onChange={onFilesSelected}
                  onDrop={onFilesSelected}
                  allowMultiple={true}
                />
              </TabPanel>
              <TabPanel dataElement="portfolioUploadFolder">
                <></>
              </TabPanel>
            </div>
          </Tabs>
        )}
        {(items.length > 0) && (
          <>
            <div className="divider"></div>
            <PortfolioItemGrid
              items={items}
              onDeleteItem={deleteItem}
            />
          </>
        )}
        <div className="divider"></div>
        <div className="footer">
          <div
            className={addItemOptionClass}
            onClick={toggleAddItemOption}
          >
            <Icon
              glyph="icon-portfolio-file"
              className="add-item-icon"
            />
            <div className="add-item-option-text">
              {`${t('portfolio.addFiles')}...`}
            </div>
            <Button
              img={`icon-chevron-${isAddPopupActive ? 'up' : 'down'}`}
            />
            <div className="add-item-trigger" data-element={DataElements.PORTFOLIO_MODAL_ADD_ITEM_TRIGGER}></div>
            {isAddPopupActive && (
              <AddItemPopup
                triggerElementName={DataElements.PORTFOLIO_MODAL_ADD_ITEM_TRIGGER}
                onClose={closePopup}
                onAddFiles={addFiles}
                onAddFolder={addFolder}
              />
            )}
          </div>
          <button className="create-portfolio" disabled={items.length === 0} onClick={create}>
            {t('action.create')}
          </button>
        </div>
        <input
          ref={fileInputRef}
          multiple
          style={{ display: 'none' }}
          type="file"
          onChange={(event) => {
            handleFileChange(event);
            event.target.value = null;
          }}
        />
      </div>
    </div>
  );
};

export default CreatePortfolioModal;
