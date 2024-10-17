import React from 'react';
import NoteContent from './NoteContent';
import NoteContext from '../Note/Context';
import { initialColors } from 'helpers/initialColorStates';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'Components/Note/NoteContent',
  component: NoteContent,
  includeStories: ['Basic', 'BasicWithSkipAutoLink'],
  excludeStories: ['testProps', 'testPropsWithSkipAutoLink'],
  parameters: {
    customizableUI: true,
  }
};

const initialState = {
  viewer: {
    disabledElements: {},
    openElements: {},
    customElementOverrides: {},
    activeDocumentViewerKey: 1,
    colorMap: {
      '1': initialColors[0]
    },
    flyoutMap: {},
  }
};
function rootReducer(state = initialState, action) {
  return state;
}

const store = configureStore({
  preloadedState: initialState,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

const context = {
  pendingEditTextMap: {},
  pendingReplyMap: {},
  pendingAttachmentMap: {},
  isSelected: false,
  searchInput: ''
};

const mockAnnotation = {
  Author: 'Mikel Landa',
  getReplies: () => [1, 2, 3],
  getStatus: () => '',
  isReply: () => false,
  getAssociatedNumber: () => 1,
  StrokeColor: {
    'R': 255,
    'G': 205,
    'B': 69,
    'A': 1,
    toHexString: () => initialColors[0]
  },
  FillColor: {
    'R': 255,
    'G': 205,
    'B': 69,
    'A': 1,
    toHexString: () => initialColors[0]
  },
  getCustomData: (key) => {
    const customData = {
      'trn-annot-preview': ''
    };

    return customData[key];
  },
  getContents: () => 'This is test.com',
  getRichTextStyle: () => {},
  getAttachments: () => [],
  getSkipAutoLink: () => false,
  getPageNumber: () => 1,
};

export const testProps = {
  icon: 'icon-tool-shape-rectangle',
  language: 'en',
  noteDateFormat: 'MMM D, LT',
  iconColor: 'StrokeColor',
  annotation: mockAnnotation,
  isReply: false,
  isUnread: false,
  renderAuthorName: () => 'Mikel Landa',
  isStateDisabled: false,
  isEditing: false,
};

const mockAnnotationWithSkipAutoLink = {
  ...mockAnnotation,
  getSkipAutoLink: () => true,
};

export const testPropsWithSkipAutoLink = {
  ...testProps,
  annotation: mockAnnotationWithSkipAutoLink,
};

export function Basic() {
  return (
    <Provider store={store}>
      <NoteContext.Provider value={context}>
        <div style={{ height: '200px' }}>
          <NoteContent {...testProps} />
        </div>
      </NoteContext.Provider>
    </Provider>
  );
}

export function BasicWithSkipAutoLink() {
  return (
    <Provider store={store}>
      <NoteContext.Provider value={context}>
        <div style={{ height: '200px' }}>
          <NoteContent {...testPropsWithSkipAutoLink} />
        </div>
      </NoteContext.Provider>
    </Provider>
  );
}