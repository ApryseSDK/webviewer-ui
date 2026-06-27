import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Bookmark from './Bookmark';
import { menuItems } from 'helpers/outlineFlyoutHelper';
import Panel from 'components/Panel';

const NOOP = () => { };

export default {
  title: 'Components/Bookmark',
  component: Bookmark,
  includeStories: ['Basic', 'Adding'],
};

const initialState = {
  viewer: {
    disabledElements: {
      logoBar: { disabled: true },
    },
    customElementOverrides: {},
    panelWidths: {
      bookmarksPanel: 330,
    },
    sortStrategy: 'position',
    isInDesktopOnlyMode: true,
    modularHeaders: {},
    pageLabels: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
    ],
    currentPage: 3,
    flyoutMap: {
      'bookmarkFlyout-outlinePath': {
        dataElement: 'bookmarkFlyout-outlinePath',
        items: menuItems,
      }
    },
    activeFlyout: 'bookmarkFlyout-outlinePath',
    openElements: {
      bookmarksPanel: true,
      'bookmarkFlyout-outlinePath': true,
    }
  },
  document: {
    bookmarks: {
      0: 'B1',
      1: 'B2',
    }
  },
  featureFlags: {
    customizableUI: true,
  },
};

const renderInBookmarksPanel = (children) => (
  <Provider store={configureStore({ reducer: () => initialState })}>
    <Panel dataElement="bookmarksPanel" location="left">
      {children}
    </Panel>
  </Provider>
);

export const Basic = () => {
  return renderInBookmarksPanel(
    <Bookmark
      text='Double click to rename me'
      label='Page 1 - Bookmark Title'
      defaultLabel='Page 1'
      pageIndex={0}
      isAdding={false}
      isMultiSelectionMode={false}
      setSelected={NOOP}
      onSave={NOOP}
      onRemove={NOOP}
      onCancel={NOOP}
    />
  );
};

export const Adding = () => {
  return renderInBookmarksPanel(
    <Bookmark
      text='A bookmark'
      label='Page 1 - Bookmark Title'
      defaultLabel='Page 1'
      pageIndex={0}
      isAdding={true}
      isMultiSelectionMode={false}
      setSelected={NOOP}
      onSave={NOOP}
      onRemove={NOOP}
      onCancel={NOOP}
    />
  );
};
