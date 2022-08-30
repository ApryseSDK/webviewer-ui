
import React from 'react';
import BookmarksPanel from './BookmarksPanel';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import '../LeftPanel/LeftPanel.scss';

export default {
  title: 'Components/BookmarksPanel',
  component: BookmarksPanel,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
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
  },
  document: {
    bookmarks: {
      0: 'B1',
      1: 'B2',
    }
  }
};

// mock the core API so stories can run
window.documentViewer.setBookmarkIconShortcutVisibility = () => { };

export const Basic = () => {
  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={configureStore({ reducer: () => initialState })}>
          <BookmarksPanel />
        </Provider>
      </div>
    </div>
  );
};
