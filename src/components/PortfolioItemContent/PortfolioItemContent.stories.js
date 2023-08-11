import React from 'react';
import { legacy_createStore as createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import PortfolioItemContent from './PortfolioItemContent';
import PortfolioContext from '../PortfolioPanel/PortfolioContext';
import '../LeftPanel/LeftPanel.scss';

const NOOP = () => { };

export default {
  title: 'Components/PortfolioItemContent',
  component: PortfolioItemContent,
};

const reducer = () => {
  return {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
    },
  };
};

const portfolioItem = {
  name: 'A test file.pdf',
  id: '0',
};

const portfolioItem2 = {
  name: '',
  id: '0',
};

const portfolioItemFolder = {
  name: 'A test folder',
  id: '0',
};

export const File = () => {
  return (
    <ReduxProvider store={createStore(reducer)}>
      <div className='Panel LeftPanel PortfolioPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <div className='bookmark-outline-single-container default'>
            <PortfolioContext.Provider
              value={{
                addNewFolder: NOOP,
              }}
            >
              <PortfolioItemContent
                portfolioItem={portfolioItem}
                setIsHovered={NOOP}
              />
            </PortfolioContext.Provider>
          </div>
        </div>
      </div>
    </ReduxProvider>
  );
};

export const Folder = () => {
  return (
    <ReduxProvider store={createStore(reducer)}>
      <div className='Panel LeftPanel PortfolioPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <div className='bookmark-outline-single-container default'>
            <PortfolioContext.Provider
              value={{
                addNewFolder: NOOP,
              }}
            >
              <PortfolioItemContent
                portfolioItem={portfolioItemFolder}
                isFolder={true}
                setIsHovered={NOOP}
              />
            </PortfolioContext.Provider>
          </div>
        </div>
      </div>
    </ReduxProvider>
  );
};

export const Adding = () => {
  return (
    <ReduxProvider store={createStore(reducer)}>
      <div className='Panel LeftPanel PortfolioPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <div className='bookmark-outline-single-container editing'>
            <PortfolioContext.Provider
              value={{
                addNewFolder: NOOP,
                setAddingNewFolder: NOOP,
                refreshPortfolio: NOOP,
              }}
            >
              <PortfolioItemContent
                portfolioItem={portfolioItem2}
                isAdding={true}
                isFolder={true}
                setIsHovered={NOOP}
              />
            </PortfolioContext.Provider>
          </div>
        </div>
      </div>
    </ReduxProvider>
  );
};

export const Renaming = () => {
  return (
    <ReduxProvider store={createStore(reducer)}>
      <div className='Panel LeftPanel PortfolioPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <div className='bookmark-outline-single-container editing'>
            <PortfolioContext.Provider
              value={{
                addNewFolder: NOOP,
                refreshPortfolio: NOOP,
                renamePortfolioItem: NOOP,
                removePortfolioItem: NOOP,
              }}
            >
              <PortfolioItemContent
                portfolioItem={portfolioItemFolder}
                isFolder={true}
                isPortfolioRenaming={true}
                setPortfolioRenaming={NOOP}
                setIsHovered={NOOP}
              />
            </PortfolioContext.Provider>
          </div>
        </div>
      </div>
    </ReduxProvider>
  );
};