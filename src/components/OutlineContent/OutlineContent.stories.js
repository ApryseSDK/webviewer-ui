import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import OutlineContent from './OutlineContent';
import OutlineContext from '../Outline/Context';
import { menuItems } from 'helpers/outlineFlyoutHelper';
import Panel from 'components/Panel';

const NOOP = () => { };

export default {
  title: 'Components/OutlineContent',
  component: OutlineContent,
};

const reducer = () => {
  return {
    viewer: {
      disabledElements: {
        logoBar: { disabled: true },
      },
      customElementOverrides: {},
      isOutlineEditingEnabled: true,
      openElements: {
        outlinesPanel: true,
        'bookmarkOutlineFlyout-': true,
      },
      panelWidths: {
        outlinesPanel: 330,
      },
      sortStrategy: 'position',
      isInDesktopOnlyMode: true,
      modularHeaders: {},
      flyoutMap: {
        'bookmarkOutlineFlyout-': {
          dataElement: 'bookmarkOutlineFlyout-',
          items: menuItems,
        }
      },
      activeFlyout: 'bookmarkOutlineFlyout-',
    },
    document: {
      outlines: {},
    },
    featureFlags: {
      customizableUI: true,
    },
  };
};

const renderInOutlinesPanel = (store, children) => (
  <ReduxProvider store={store}>
    <Panel dataElement="outlinesPanel" location="left">
      {children}
    </Panel>
  </ReduxProvider>
);

const changingDestReducer = () => {
  return {
    ...reducer(),
    viewer: {
      ...reducer().viewer,
      outlinesStateMap: {
        1: {
          '0': { isChangingDest: true },
        },
      },
    },
  };
};

export const Basic = () => {
  return renderInOutlinesPanel(configureStore({ reducer: changingDestReducer }),
    <div className='bookmark-outline-single-container default'>
      <OutlineContext.Provider
        value={{
          isMultiSelectMode: false,
          isOutlineEditable: true,
          addNewOutline: NOOP,
          renameOutline: NOOP,
          removeOutlines: NOOP,
        }}
      >
        <OutlineContent
          outlinePath='0'
          text='A test outline'
          setIsHovered={NOOP}
          onCancel={NOOP}
          isChangingDest={true}
        />
      </OutlineContext.Provider>
    </div>
  );
};

export const Adding = () => {
  return renderInOutlinesPanel(configureStore({ reducer: reducer }),
    <div className='bookmark-outline-single-container editing'>
      <OutlineContext.Provider
        value={{
          currentDestPage: 1,
          currentDestText: 'Full Page',
          isMultiSelectMode: false,
          isOutlineEditable: true,
          addNewOutline: NOOP,
          renameOutline: NOOP,
          removeOutlines: NOOP,
        }}
      >
        <OutlineContent
          outlinePath='0'
          text=''
          isAdding={true}
          setIsHovered={NOOP}
          isRenaming={false}
          onCancel={NOOP}
        />
      </OutlineContext.Provider>
    </div>
  );
};

export const Renaming = () => {
  return renderInOutlinesPanel(configureStore({ reducer: reducer }),
    <div className='bookmark-outline-single-container editing'>
      <OutlineContext.Provider
        value={{
          isMultiSelectMode: false,
          isOutlineEditable: true,
          addNewOutline: NOOP,
          renameOutline: NOOP,
          removeOutlines: NOOP,
        }}
      >
        <OutlineContent
          outlinePath='0'
          text='A test outline'
          setIsHovered={NOOP}
          isRenaming={true}
          onCancel={NOOP}
        />
      </OutlineContext.Provider>
    </div>
  );
};

export const ChangingDestination = () => {
  return renderInOutlinesPanel(configureStore({ reducer: changingDestReducer }),
    <div className='bookmark-outline-single-container editing'>
      <OutlineContext.Provider
        value={{
          isMultiSelectMode: false,
          isOutlineEditable: true,
          addNewOutline: NOOP,
          renameOutline: NOOP,
          removeOutlines: NOOP,
          currentDestPage: 1,
          currentDestText: 'Area Selection',
        }}
      >
        <OutlineContent
          outlinePath='0'
          text='A test outline'
          setIsHovered={NOOP}
          onCancel={NOOP}
          isChangingDest={true}
        />
      </OutlineContext.Provider>
    </div>
  );
};

export const ColoredOutline = () => {
  return renderInOutlinesPanel(configureStore({ reducer: changingDestReducer }),
    <div className='bookmark-outline-single-container default'>
      <OutlineContext.Provider
        value={{
          isMultiSelectMode: false,
          isOutlineEditable: true,
          addNewOutline: NOOP,
          renameOutline: NOOP,
          removeOutlines: NOOP,
        }}
      >
        <OutlineContent
          outlinePath='0'
          text='A colored outline'
          isChangingDest={true}
          setIsHovered={NOOP}
          textColor="rgb(213, 42, 42)"
          onCancel={NOOP}
        />
      </OutlineContext.Provider>
    </div>
  );
};
