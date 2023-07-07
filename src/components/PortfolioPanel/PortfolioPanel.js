import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import TouchBackEnd from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import selectors from 'selectors';

import Button from 'components/Button';
import PortfolioContext from './PortfolioContext';
import PortfolioItem from 'components/PortfolioItem';
import PortfolioItemContent from 'components/PortfolioItemContent';
import { PortfolioDragLayer } from './PortfolioDragLayer';
import DataElementWrapper from 'components/DataElementWrapper';
import DataElements from 'constants/dataElement';
import { isMobileDevice } from 'helpers/device';

import '../../constants/bookmarksOutlinesShared.scss';
import './PortfolioPanel.scss';

const PortfolioPanel = ({ portfolioFiles }) => {
  const [
    isDisabled,
    tabManager,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.PORTFOLIO_PANEL),
      selectors.getTabManager(state),
    ],
    shallowEqual,
  );

  const [t] = useTranslation();

  const [activePortfolioItem, setActivePortfolioItem] = useState(null);
  const [isAddingNewFolder, setAddingNewFolder] = useState(false);

  const addNewFile = () => {
  };

  const addNewFolder = (name) => {
    if (!name) {
      name = t('message.untitled');
    }
    // TODO: add new folder to portfolio here
    refreshPortfolio();
  };

  const renamePortfolio = () => {
    // TODO: rename file or folder here
    refreshPortfolio();
  };

  const refreshPortfolio = () => {
    setAddingNewFolder(false);
  };

  const removePortfolio = (name) => {
    /* eslint-disable no-console */
    console.log('removePortfolio', name);
    // TODO: remove file or folder here
    refreshPortfolio();
  };

  const movePortfolioInward = (dragPortfolioItem, dropPortfolioItem) => {
    console.log(dragPortfolioItem.name, 'movePortfolioInward', dropPortfolioItem.name);
  };

  const movePortfolioBeforeTarget = (dragPortfolioItem, dropPortfolioItem) => {
    console.log(dragPortfolioItem.name, 'movePortfolioBeforeTarget', dropPortfolioItem.name);
  };

  const movePortfolioAfterTarget = (dragPortfolioItem, dropPortfolioItem) => {
    console.log(dragPortfolioItem.name, 'movePortfolioAfterTarget', dropPortfolioItem.name);
    /* eslint-enable no-console */
  };

  if (isDisabled) {
    return null;
  }

  return (
    <DataElementWrapper
      className="Panel PortfolioPanel bookmark-outline-panel"
      dataElement={DataElements.PORTFOLIO_PANEL}
    >
      <div className="bookmark-outline-panel-header">
        <div className="header-title">
          {t('portfolioPanel.portfolioPanelTitle')}
        </div>

        <div className="portfolio-panel-control">
          <Button
            className="portfolio-panel-control-button"
            dataElement={DataElements.PORTFOLIO_ADD_FILE}
            img="icon-add-file"
            title={t('portfolioPanel.portfolioAddFile')}
            disabled={isAddingNewFolder}
            onClick={addNewFile}
          />
          <Button
            className="portfolio-panel-control-button"
            dataElement={DataElements.PORTFOLIO_ADD_FOLDER}
            img="icon-add-folder"
            title={t('portfolioPanel.portfolioAddFolder')}
            disabled={isAddingNewFolder}
            onClick={() => setAddingNewFolder(true)}
          />
        </div>
      </div>

      <PortfolioContext.Provider
        value={{
          activePortfolioItem,
          setActivePortfolioItem,
          isPortfolioItemActive: (portfolioItem) => portfolioItem?.id === activePortfolioItem,
          isAddingNewFolder,
          setAddingNewFolder,
          addNewFolder,
          renamePortfolio,
          removePortfolio,
          refreshPortfolio,
          tabManager,
        }}
      >
        <DndProvider backend={isMobileDevice ? TouchBackEnd : HTML5Backend}>
          <PortfolioDragLayer />

          <div className="bookmark-outline-row">
            {portfolioFiles.map((item) => (
              <PortfolioItem
                key={item.id}
                portfolioItem={item}
                movePortfolioInward={movePortfolioInward}
                movePortfolioBeforeTarget={movePortfolioBeforeTarget}
                movePortfolioAfterTarget={movePortfolioAfterTarget}
              />
            ))}

            {isAddingNewFolder && (
              <DataElementWrapper className="bookmark-outline-single-container editing">
                <PortfolioItemContent
                  name={''}
                  id={'0'}
                  isFolder
                  isAdding
                />
              </DataElementWrapper>
            )}
          </div>
        </DndProvider>

        <DataElementWrapper
          className="bookmark-outline-footer"
          dataElement={DataElements.PORTFOLIO_ADD_NEW_BUTTON}
        >
          <Button
            className="bookmark-outline-control-button add-new-button"
            dataElement={DataElements.PORTFOLIO_ADD_NEW_BUTTON}
            label={t('portfolioPanel.portfolioCreateFolder')}
            img="icon-menu-add"
            disabled={isAddingNewFolder}
            onClick={() => setAddingNewFolder(true)}
          />
        </DataElementWrapper>
      </PortfolioContext.Provider>
    </DataElementWrapper>
  );
};

export default PortfolioPanel;
