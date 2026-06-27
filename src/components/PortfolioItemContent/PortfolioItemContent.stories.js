import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import PortfolioItemContent from './PortfolioItemContent';
import PortfolioContext from '../PortfolioPanel/PortfolioContext';
import { menuItems } from 'helpers/outlineFlyoutHelper';
import { disableRtlModeParameters } from 'helpers/storybookParams';
import Panel from 'components/Panel';

const NOOP = () => { };

export default {
  title: 'Components/PortfolioItemContent',
  component: PortfolioItemContent,
};

const reducer = () => {
  return {
    viewer: {
      disabledElements: {
        logoBar: { disabled: true },
      },
      customElementOverrides: {},
      openElements: {
        portfolioPanel: true,
        'bookmarkOutlineFlyout-0': true,
      },
      panelWidths: {
        portfolioPanel: 330,
      },
      sortStrategy: 'position',
      isInDesktopOnlyMode: true,
      modularHeaders: {},
      flyoutMap: {
        'bookmarkOutlineFlyout-0': {
          dataElement: 'bookmarkOutlineFlyout-0',
          items: menuItems,
        }
      },
      activeFlyout: 'bookmarkOutlineFlyout-0',
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

const renderInPortfolioPanel = (children) => (
  <ReduxProvider store={configureStore({ reducer: reducer })}>
    <Panel dataElement="portfolioPanel" location="left">
      <div className='PortfolioPanel'>
        {children}
      </div>
    </Panel>
  </ReduxProvider>
);

export const File = () => {
  return renderInPortfolioPanel(
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
  );
};

export const Folder = () => {
  return renderInPortfolioPanel(
    <div className='bookmark-outline-single-container default'>
      <PortfolioContext.Provider
        value={PortfolioContextValues}
      >
        <PortfolioItemContent
          portfolioItem={portfolioItemFolder}
          setIsHovered={NOOP}
          isAdding={false}
        />
      </PortfolioContext.Provider>
    </div>
  );
};

export const Adding = () => {
  return renderInPortfolioPanel(
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
  );
};
Adding.parameters = disableRtlModeParameters;

export const Renaming = () => {
  return renderInPortfolioPanel(
    <div className='bookmark-outline-single-container editing'>
      <PortfolioContext.Provider
        value={PortfolioContextValues}
      >
        <PortfolioItemContent
          portfolioItem={portfolioItem}
          isPortfolioRenaming={true}
          setPortfolioRenaming={NOOP}
        />
      </PortfolioContext.Provider>
    </div>
  );
};

export const RenamingDuplicateError = () => {
  return renderInPortfolioPanel(
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
  );
};
