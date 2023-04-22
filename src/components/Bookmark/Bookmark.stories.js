import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Bookmark from './Bookmark';
import '../LeftPanel/LeftPanel.scss';

const NOOP = () => { };

export default {
  title: 'Components/Bookmark',
  component: Bookmark,
  includeStories: ['Basic', 'Adding'],
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
    currentPage: 3,
  },
  document: {
    bookmarks: {
      0: 'B1',
      1: 'B2',
    }
  }
};

export const Basic = () => {
  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={configureStore({ reducer: () => initialState })}>
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
        </Provider>
      </div>
    </div>
  );
};

export const Adding = () => {
  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={configureStore({ reducer: () => initialState })}>
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
        </Provider>
      </div>
    </div>
  );
};
