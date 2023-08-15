import React, { useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import TouchBackEnd from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import selectors from 'selectors';
import actions from 'actions';

import Button from 'components/Button';
import PortfolioContext from './PortfolioContext';
import PortfolioItem from 'components/PortfolioItem';
import PortfolioItemContent from 'components/PortfolioItemContent';
import { PortfolioDragLayer } from './PortfolioDragLayer';
import DataElementWrapper from 'components/DataElementWrapper';
import DataElements from 'constants/dataElement';
import { isMobileDevice } from 'helpers/device';
import { enableMultiTab } from 'helpers/TabManager';
import { isOpenableFile } from 'helpers/portfolioUtils';

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

  const dispatch = useDispatch();
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

  const renamePortfolioItem = () => {
    // TODO: rename file or folder here
    refreshPortfolio();
  };

  const refreshPortfolio = () => {
    setAddingNewFolder(false);
  };

  const removePortfolioItem = (name) => {
    /* eslint-disable no-console */
    console.log('removePortfolio', name);
    // TODO: remove file or folder here
    refreshPortfolio();
  };

  const openPortfolioItem = (portfolioItem) => {
    if (isOpenableFile(portfolioItem)) {
      dispatch(enableMultiTab());
      dispatch(actions.addPortfolioTab(portfolioItem));
    }
  };

  const isNameDuplicated = (name, id) => {
    const otherFiles = portfolioFiles.filter((file) => file.id !== id);
    return otherFiles.some((file) => file.name === name);
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
          {t('portfolio.portfolioPanelTitle')}
        </div>

        <div className="portfolio-panel-control">
          <Button
            className="portfolio-panel-control-button"
            dataElement={DataElements.PORTFOLIO_ADD_FILE}
            img="icon-add-file"
            title={t('portfolio.addFile')}
            disabled={isAddingNewFolder}
            onClick={addNewFile}
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
          renamePortfolioItem,
          removePortfolioItem,
          openPortfolioItem,
          refreshPortfolio,
          isNameDuplicated,
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
      </PortfolioContext.Provider>
    </DataElementWrapper>
  );
};

export default PortfolioPanel;
