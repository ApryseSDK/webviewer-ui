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
                name='A test file.pdf'
                id='0'
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
                name='A test folder'
                id='0'
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
                name=''
                id='0'
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
                renamePortfolio: NOOP,
                removePortfolio: NOOP,
              }}
            >
              <PortfolioItemContent
                name='A test folder'
                id='0'
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