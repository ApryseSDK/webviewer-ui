import React from 'react';
import NoteContent from './NoteContent';
import NoteContext from '../Note/Context';

import { createStore } from 'redux';

import { Provider } from 'react-redux';

export default {
  title: 'Components/Note/NoteContent',
  component: NoteContent,
  includeStories: ['Basic', 'BasicWithSkipAutoLink'],
  excludeStories: ['testProps', 'testPropsWithSkipAutoLink'],
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    activeDocumentViewerKey: 1,
    colorMap: {
      '1': '#E44234'
    }
  }
};
function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

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
    toHexString: () => '#E44234'
  },
  FillColor: {
    'R': 255,
    'G': 205,
    'B': 69,
    'A': 1,
    toHexString: () => '#E44234'
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