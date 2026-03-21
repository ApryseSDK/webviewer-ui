import React from 'react';
import { legacy_createStore as createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import OutlineContent from './OutlineContent';
import OutlineContext from '../Outline/Context';
import { menuItems } from 'helpers/outlineFlyoutHelper';
import '../LeftPanel/LeftPanel.scss';

const NOOP = () => { };

export default {
  title: 'Components/OutlineContent',
  component: OutlineContent,
};

const reducer = () => {
  return {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
      isOutlineEditingEnabled: true,
      flyoutMap: {
        'bookmarkOutlineFlyout-': {
          dataElement: 'bookmarkOutlineFlyout-',
          items: menuItems,
        }
      },
      activeFlyout: 'bookmarkOutlineFlyout-',
      openElements: {
        'bookmarkOutlineFlyout-': true,
      }
    },
    document: {
      outlines: {},
    },
    featureFlags: {
      customizableUI: true,
    },
  };
};

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
  return (
    <ReduxProvider store={createStore(changingDestReducer)}>
      <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <div className='bookmark-outline-single-container default'>
            <OutlineContext.Provider
              value={{
                isMultiSelectMode: false,
                isOutlineEditable: true,
                addNewOutline: NOOP,
                renameOutline: NOOP,
                removeOutlines: NOOP,
                outlineScrollParentRef: { current: null },
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
        </div>
      </div>
    </ReduxProvider>
  );
};

export const Adding = () => {
  return (
    <ReduxProvider store={createStore(reducer)}>
      <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
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
                outlineScrollParentRef: { current: null },
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
        </div>
      </div>
    </ReduxProvider>
  );
};

export const Renaming = () => {
  return (
    <ReduxProvider store={createStore(reducer)}>
      <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <div className='bookmark-outline-single-container editing'>
            <OutlineContext.Provider
              value={{
                isMultiSelectMode: false,
                isOutlineEditable: true,
                addNewOutline: NOOP,
                renameOutline: NOOP,
                removeOutlines: NOOP,
                outlineScrollParentRef: { current: null },
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
        </div>
      </div>
    </ReduxProvider>
  );
};

export const ChangingDestination = () => {
  return (
    <ReduxProvider store={createStore(changingDestReducer)}>
      <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
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
                outlineScrollParentRef: { current: null },
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
        </div>
      </div>
    </ReduxProvider>
  );
};

export const ColoredOutline = () => {
  return (
    <ReduxProvider store={createStore(changingDestReducer)}>
      <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
        <div className='left-panel-container' style={{ minWidth: '330px' }}>
          <div className='bookmark-outline-single-container default'>
            <OutlineContext.Provider
              value={{
                isMultiSelectMode: false,
                isOutlineEditable: true,
                addNewOutline: NOOP,
                renameOutline: NOOP,
                removeOutlines: NOOP,
                outlineScrollParentRef: { current: null },
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
        </div>
      </div>
    </ReduxProvider>
  );
};
