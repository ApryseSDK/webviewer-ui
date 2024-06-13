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
  nameWithoutExtension: 'A test file',
  extension: 'pdf',
  id: '0',
};

const portfolioFolderAdding = {
  name: '',
  id: '0',
  isFolder: true,
};

const portfolioItemFolder = {
  name: 'A test folder',
  id: '0',
  isFolder: true,
};

const PortfolioContextValues = {
  addNewFolder: NOOP,
  setAddingNewFolder: NOOP,
  refreshPortfolio: NOOP,
  renamePortfolioItem: NOOP,
  removePortfolioItem: NOOP,
  isNameDuplicated: NOOP,
};

export const File = () => {
  return (
    <ReduxProvider store={createStore(reducer)}>
      <div className='Panel LeftPanel PortfolioPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <div className='bookmark-outline-single-container default'>
            <PortfolioContext.Provider
              value={PortfolioContextValues}
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
              value={PortfolioContextValues}
            >
              <PortfolioItemContent
                portfolioItem={portfolioItemFolder}
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
              value={PortfolioContextValues}
            >
              <PortfolioItemContent
                portfolioItem={portfolioFolderAdding}
                isAdding={true}
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
              value={PortfolioContextValues}
            >
              <PortfolioItemContent
                portfolioItem={portfolioItem}
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

export const RenamingDuplicateError = () => {
  return (
    <ReduxProvider store={createStore(reducer)}>
      <div className='Panel LeftPanel PortfolioPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <div className='bookmark-outline-single-container editing'>
            <PortfolioContext.Provider
              value={{
                ...PortfolioContextValues,
                isNameDuplicated: () => true,
              }}
            >
              <PortfolioItemContent
                portfolioItem={portfolioItem}
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