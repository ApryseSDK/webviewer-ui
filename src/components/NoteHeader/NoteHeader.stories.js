import React from 'react';
import NoteHeader from './NoteHeader';
import NoteContext from '../Note/Context';

import { createStore } from 'redux';

import { Provider } from 'react-redux';

export default {
  title: 'Components/Note/NoteHeader',
  component: NoteHeader,
  includeStories: ['Basic', 'BasicWithAnnotationNumbering'],
  excludeStories: ['testProps'],
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};
function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

const context = {
  pendingEditTextMap: {},
  pendingReplyMap: {},
  pendingAttachmentMap: {}
};

const mockAnnotation = {
  Author: 'Mikel Landa',
  DateCreated: '2021-08-19T22:43:04.795Z',
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
  }
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

export function Basic() {
  return (
    <Provider store={store}>
      <NoteContext.Provider value={context}>
        <NoteHeader {...testProps} />
      </NoteContext.Provider>
    </Provider>
  );
}

export const testPropsWithAnnotationNumbering = {
  ...testProps,
  showAnnotationNumbering: true,
};

export function BasicWithAnnotationNumbering() {
  return (
    <Provider store={store}>
      <NoteContext.Provider value={context}>
        <NoteHeader {...testPropsWithAnnotationNumbering} />
      </NoteContext.Provider>
    </Provider>
  );
}
